import { requireSupabase } from '../lib/supabaseClient'
import type { AdminUser, Attendee, DashboardStats } from '../types'

export function getDaysRemaining(): number {
  const targetDate = new Date('2026-11-29T00:00:00+01:00').getTime()
  return Math.max(0, Math.ceil((targetDate - Date.now()) / 86_400_000))
}

function mapAttendee(row: Record<string, unknown>): Attendee {
  return {
    id: String(row.id), ticketId: String(row.registration_reference), fullName: String(row.full_name),
    email: String(row.email), phone: (row.phone as string | null) || undefined,
    status: row.checked_in_at ? 'checked_in' : 'confirmed', emailStatus: row.email_status as Attendee['emailStatus'],
    createdAt: String(row.created_at), checkedInAt: (row.checked_in_at as string | null) || undefined,
  }
}

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const client = requireSupabase()
  const { data, error } = await client.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
  if (error || !data.user) return { success: false, error: 'Invalid email or password.' }

  const { data: admin, error: adminError } = await client.from('admin_users').select('id,email').eq('id', data.user.id).maybeSingle()
  if (adminError || !admin) {
    await client.auth.signOut()
    return { success: false, error: 'This account is not authorized to access the admin dashboard.' }
  }
  return { success: true, user: { id: admin.id, email: admin.email || data.user.email || email, name: admin.email || email, role: 'admin' } }
}

export async function getAdminSession(): Promise<AdminUser | null> {
  const client = requireSupabase()
  const { data: { user }, error } = await client.auth.getUser()
  if (error || !user) return null
  const { data: admin } = await client.from('admin_users').select('id,email').eq('id', user.id).maybeSingle()
  return admin ? { id: admin.id, email: admin.email || user.email || '', name: admin.email || user.email || 'Admin', role: 'admin' } : null
}

export async function logoutAdmin(): Promise<void> {
  await requireSupabase().auth.signOut()
}

export async function getAttendees(search = '', status = 'all'): Promise<Attendee[]> {
  const client = requireSupabase()
  let query = client.from('registrations').select('id,full_name,email,phone,registration_reference,email_status,created_at,checked_in_at').order('created_at', { ascending: false })
  const term = search.trim().replace(/[,%()]/g, ' ')
  if (term) query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`)
  const { data, error } = await query
  if (error) throw error
  const attendees = (data || []).map((row) => mapAttendee(row))
  return status === 'all' ? attendees : attendees.filter((attendee) => attendee.status === status)
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const client = requireSupabase()
  const [totalResult, checkedResult] = await Promise.all([
    client.from('registrations').select('id', { count: 'exact', head: true }),
    client.from('registrations').select('id', { count: 'exact', head: true }).not('checked_in_at', 'is', null),
  ])
  if (totalResult.error) throw totalResult.error
  if (checkedResult.error) throw checkedResult.error
  const total = totalResult.count || 0
  return { totalRegistrations: total, checkedInCount: checkedResult.count || 0, confirmedCount: total, daysRemaining: getDaysRemaining(), venueCapacity: 5000 }
}

export async function updateAttendeeStatus(id: string, status: Attendee['status']): Promise<Attendee | null> {
  const client = requireSupabase()
  const checkedInAt = status === 'checked_in' ? new Date().toISOString() : null
  const { data, error } = await client.from('registrations').update({ checked_in_at: checkedInAt }).eq('id', id)
    .select('id,full_name,email,phone,registration_reference,email_status,created_at,checked_in_at').maybeSingle()
  if (error) throw error
  return data ? mapAttendee(data) : null
}

export function exportAttendeesToCSV(attendees: Attendee[]): void {
  const quote = (value: unknown) => {
    const text = String(value ?? '')
    const safeText = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
    return `"${safeText.replace(/"/g, '""')}"`
  }
  const headers = ['Registration Reference', 'Full Name', 'Email', 'Phone', 'Email Status', 'Registered Date']
  const rows = attendees.map((a) => [a.ticketId, a.fullName, a.email, a.phone || '', a.emailStatus, new Date(a.createdAt).toLocaleString()])
  const blob = new Blob([[headers, ...rows].map((row) => row.map(quote).join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `ebenezer-attendees-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
