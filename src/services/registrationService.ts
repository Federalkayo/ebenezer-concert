import { requireSupabase } from '../lib/supabaseClient'
import type { Attendee, RegistrationPayload, RegistrationResponse } from '../types'

export async function registerAttendee(payload: RegistrationPayload): Promise<RegistrationResponse> {
  const client = requireSupabase()
  const { data, error } = await client.functions.invoke('register-attendee', {
    body: { fullName: payload.fullName, email: payload.email, phone: payload.phone || null },
  })

  if (error) {
    const body = (error as Error & { context?: { json?: () => Promise<{ error?: string }> } }).context
    const details = await body?.json?.().catch(() => null)
    return { success: false, message: details?.error || error.message || 'Registration failed. Please try again.' }
  }
  if (!data?.success) return { success: false, message: data?.error || 'Registration failed. Please try again.' }

  const attendee: Attendee = {
    id: data.id,
    ticketId: data.registrationReference,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone || undefined,
    status: 'confirmed',
    emailStatus: data.emailStatus,
    createdAt: data.createdAt,
  }
  return { success: true, ticketId: attendee.ticketId, attendee, message: 'Registration successful! Your free ticket pass is confirmed.' }
}
