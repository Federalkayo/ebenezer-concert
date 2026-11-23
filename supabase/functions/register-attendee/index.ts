import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('SITE_ORIGIN') || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const response = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return response({ error: 'Method not allowed.' }, 405)

  let payload: { fullName?: unknown; email?: unknown; phone?: unknown }
  try { payload = await request.json() } catch { return response({ error: 'Please submit a valid registration.' }, 400) }

  const fullName = typeof payload.fullName === 'string' ? payload.fullName.trim().replace(/\s+/g, ' ') : ''
  const email = typeof payload.email === 'string' ? payload.email.trim() : ''
  const normalizedEmail = email.toLowerCase()
  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : ''
  if (fullName.length < 2 || fullName.length > 160) return response({ error: 'Please provide a valid full name.' }, 400)
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return response({ error: 'Please enter a valid email address.' }, 400)
  if (phone.length > 40) return response({ error: 'Please enter a valid phone number.' }, 400)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  if (!supabaseUrl || !serviceKey) return response({ error: 'Registration service is not configured.' }, 503)
  const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

  const registrationReference = `EBZ-2026-${crypto.randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`
  const { data: registration, error: insertError } = await db.from('registrations').insert({
    full_name: fullName, email, normalized_email: normalizedEmail, phone: phone || null,
    registration_reference: registrationReference,
  }).select('id,full_name,email,phone,registration_reference,email_status,created_at').single()

  if (insertError) {
    if (insertError.code === '23505' && insertError.message.includes('normalized_email')) {
      return response({ error: 'This email address is already registered for EBENEZER 2026.' }, 409)
    }
    if (insertError.code === '23505') return response({ error: 'Please try again to complete your registration.' }, 503)
    console.error('Registration insert failed:', insertError.message)
    return response({ error: 'We could not complete your registration. Please try again.' }, 500)
  }

  let emailStatus: 'sent' | 'failed' = 'failed'
  let emailError = 'Email service is not configured.'
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  const fromEmail = Deno.env.get('RESEND_FROM_EMAIL')
  const siteOrigin = (Deno.env.get('SITE_ORIGIN') || '').replace(/\/+$/, '')
  const logoUrl = `${siteOrigin}/images/logo.jpg`
  if (resendApiKey && fromEmail) {
    const name = escapeHtml(fullName)
    const reference = escapeHtml(registrationReference)
    try {
      const mail = await fetch('https://api.resend.com/emails', {
        method: 'POST', headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromEmail, to: [email], subject: 'EBENEZER 2026 — Your Free Registration Is Confirmed',
          html: `<!doctype html><html><body style="margin:0;background:#f4f1f8;font-family:Arial,sans-serif;color:#211b2c"><div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden"><div style="padding:26px 32px;background:#271344;color:#fff"><table role="presentation" style="border-collapse:collapse"><tr><td style="vertical-align:middle;padding-right:16px"><img src="${logoUrl}" width="64" height="64" alt="Ark of God Music Team" style="display:block;width:64px;height:64px;object-fit:contain;background:#fff;border:0;border-radius:10px"></td><td style="vertical-align:middle"><div style="font-size:12px;letter-spacing:3px;color:#e6b7ff">A.O.W 2026 vol 07</div><h1 style="margin:10px 0 0;font-size:26px;line-height:1.25">Your registration is confirmed</h1></td></tr></table></div><div style="padding:32px"><p>Hello ${name},</p><p>Your free registration for <strong>A.O.W. presents EBENEZER 2026 (VOL. 07)</strong> is confirmed. We look forward to welcoming you for a time of worship, praise, thanksgiving and divine encounter as we celebrate another year of God's faithfulness under the theme EBENEZER.</p><table style="width:100%;border-collapse:collapse"><tr><td style="padding:9px 0;color:#6b6573">Date</td><td>Sunday, 29 November 2026</td></tr><tr><td style="padding:9px 0;color:#6b6573">Location</td><td>Lagos, Nigeria</td></tr><tr><td style="padding:9px 0;color:#6b6573">Venue</td><td>J &amp; P Studio, Kosofe Bus Stop, beside Glass House</td></tr><tr><td style="padding:9px 0;color:#6b6573">Time</td><td>4:00 PM–6:00 PM WAT</td></tr></table><div style="margin:24px 0;padding:18px;background:#f5effb;border-radius:10px"><div style="font-size:12px;color:#6b6573">YOUR UNIQUE REGISTRATION REFERENCE</div><div style="margin-top:6px;font-size:20px;font-weight:bold;letter-spacing:1px;color:#54248a">${reference}</div></div><p style="color:#16804a;font-weight:bold">Admission is free.</p><p style="font-size:13px;color:#777">Please keep this email and your registration reference for your records.</p></div></div></body></html>`,
        }),
      })
      if (!mail.ok) throw new Error(`Resend returned HTTP ${mail.status}`)
      emailStatus = 'sent'
      emailError = ''
    } catch (error) {
      emailError = error instanceof Error ? error.message.slice(0, 500) : 'Email delivery failed.'
      console.error('Confirmation email failed:', emailError)
    }
  }

  const { error: updateError } = await db.from('registrations').update({ email_status: emailStatus, email_error: emailError || null }).eq('id', registration.id)
  if (updateError) console.error('Unable to persist email status:', updateError.message)

  return response({
    success: true, id: registration.id, fullName: registration.full_name, email: registration.email,
    phone: registration.phone, registrationReference, emailStatus, createdAt: registration.created_at,
  }, 201)
})
