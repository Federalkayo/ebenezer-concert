import type { AdminUser, Attendee, DashboardStats } from '../types'

/**
 * ============================================================================
 * ADMIN SERVICE
 * ============================================================================
 * NOTE FOR CODEX (BACKEND INTEGRATION):
 * This service manages admin authentication, dashboard metrics, attendee queries,
 * check-in updates, and CSV export.
 *
 * TO CONNECT SUPABASE:
 * 1. For authentication:
 *    const { data, error } = await supabase.auth.signInWithPassword({
 *      email,
 *      password
 *    })
 *
 * 2. For attendee querying & filtering:
 *    let query = supabase.from('registrations').select('*').order('created_at', { ascending: false })
 *    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,ticket_id.ilike.%${search}%`)
 *    if (status && status !== 'all') query = query.eq('status', status)
 *    const { data: attendees } = await query
 *
 * 3. For check-in updates:
 *    await supabase.from('registrations').update({ status, checked_in_at: new Date().toISOString() }).eq('id', id)
 * ============================================================================
 */

const STORAGE_KEY = 'ebenezer_attendees_db'
const ADMIN_SESSION_KEY = 'ebenezer_admin_session'

const DEFAULT_ADMIN: AdminUser = {
  id: 'usr_admin_01',
  email: 'admin@ebenezer.org',
  name: 'Ebenezer Lead Admin',
  role: 'admin',
}

// Calculate days remaining until 29 November 2026
export function getDaysRemaining(): number {
  const targetDate = new Date('2026-11-29T17:00:00+01:00').getTime()
  const now = new Date().getTime()
  const diffMs = targetDate - now
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}

function getAllAttendeesFromStorage(): Attendee[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Attendee[]
  } catch {
    return []
  }
}

function saveAttendeesToStorage(attendees: Attendee[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attendees))
  } catch (err) {
    console.error('Failed to write to storage:', err)
  }
}

/**
 * Admin Login Mock
 * Default credentials for visual testing:
 * Email: admin@ebenezer.org
 * Password: admin or password
 */
export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const cleanEmail = email.trim().toLowerCase()
  if (!cleanEmail || !password) {
    return { success: false, error: 'Email and password are required.' }
  }

  // Accept admin@ebenezer.org with password 'admin2026' or 'admin' or any valid email for test convenience
  if (cleanEmail === 'admin@ebenezer.org' && (password === 'admin2026' || password === 'admin' || password === 'password')) {
    const session = { ...DEFAULT_ADMIN, email: cleanEmail }
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
    return { success: true, user: session }
  }

  // For testing flexibility, allow any @ebenezer.org email with password 'admin2026'
  if (cleanEmail.endsWith('@ebenezer.org') && password === 'admin2026') {
    const session: AdminUser = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      name: 'Event Coordinator',
      role: 'organizer',
    }
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
    return { success: true, user: session }
  }

  return { success: false, error: 'Invalid credentials. Use admin@ebenezer.org / admin2026' }
}

export function getAdminSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

export function logoutAdmin(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY)
}

/**
 * Retrieves attendees with optional search query and status filter
 */
export async function getAttendees(search?: string, status?: string): Promise<Attendee[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  let list = getAllAttendeesFromStorage()

  if (search && search.trim()) {
    const q = search.trim().toLowerCase()
    list = list.filter(
      (a) =>
        a.fullName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.ticketId.toLowerCase().includes(q) ||
        (a.phone && a.phone.includes(q))
    )
  }

  if (status && status !== 'all') {
    list = list.filter((a) => a.status === status)
  }

  return list
}

/**
 * Computes dashboard metrics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const attendees = getAllAttendeesFromStorage()
  const total = attendees.length
  const checkedIn = attendees.filter((a) => a.status === 'checked_in').length
  const confirmed = attendees.filter((a) => a.status === 'confirmed').length

  return {
    totalRegistrations: total,
    checkedInCount: checkedIn,
    confirmedCount: confirmed,
    daysRemaining: getDaysRemaining(),
    venueCapacity: 5000,
  }
}

/**
 * Updates an attendee's status (e.g. check-in at the gate)
 */
export async function updateAttendeeStatus(id: string, status: Attendee['status']): Promise<Attendee | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const list = getAllAttendeesFromStorage()
  const index = list.findIndex((a) => a.id === id)
  if (index === -1) return null

  const updatedAttendee: Attendee = {
    ...list[index],
    status,
    checkedInAt: status === 'checked_in' ? new Date().toISOString() : undefined,
  }

  list[index] = updatedAttendee
  saveAttendeesToStorage(list)
  return updatedAttendee
}

/**
 * Exports current attendees to a clean CSV file and triggers browser download
 */
export function exportAttendeesToCSV(attendees: Attendee[]): void {
  const headers = ['Ticket ID', 'Full Name', 'Email', 'Phone', 'Status', 'Registered Date', 'Checked In Time']
  const rows = attendees.map((a) => [
    `"${a.ticketId}"`,
    `"${a.fullName.replace(/"/g, '""')}"`,
    `"${a.email}"`,
    `"${a.phone || 'N/A'}"`,
    `"${a.status.toUpperCase()}"`,
    `"${new Date(a.createdAt).toLocaleString()}"`,
    `"${a.checkedInAt ? new Date(a.checkedInAt).toLocaleString() : 'N/A'}"`,
  ])

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `ebenezer-attendees-${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
