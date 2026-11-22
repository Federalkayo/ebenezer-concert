import type { Attendee, RegistrationPayload, RegistrationResponse } from '../types'

/**
 * ============================================================================
 * REGISTRATION SERVICE
 * ============================================================================
 * NOTE FOR CODEX (BACKEND INTEGRATION):
 * This service currently uses a mock implementation with localStorage persistence
 * to allow full visual and functional testing of the frontend.
 *
 * TO CONNECT SUPABASE:
 * 1. Import your supabase client:
 *    import { supabase } from '../lib/supabaseClient'
 *
 * 2. In `registerAttendee`:
 *    const { data, error } = await supabase
 *      .from('registrations')
 *      .insert([{
 *        full_name: payload.fullName,
 *        email: payload.email.toLowerCase().trim(),
 *        phone: payload.phone?.trim() || null,
 *        status: 'confirmed',
 *        ticket_id: generateTicketId()
 *      }])
 *      .select()
 *      .single()
 *
 * 3. Trigger your Supabase Edge Function to dispatch confirmation email with the ticket QR code.
 * ============================================================================
 */

const STORAGE_KEY = 'ebenezer_attendees_db'

// Initial seed data for realistic presentation
const SEED_ATTENDEES: Attendee[] = [
  {
    id: 'att-101',
    ticketId: 'EBZ-2026-78421',
    fullName: 'Emmanuel Adeyemi',
    email: 'emmanuel.adeyemi@example.com',
    phone: '+234 803 123 4567',
    status: 'confirmed',
    createdAt: '2026-11-18T14:22:00Z',
  },
  {
    id: 'att-102',
    ticketId: 'EBZ-2026-65190',
    fullName: 'Grace Chidinma',
    email: 'grace.chidinma@example.com',
    phone: '+234 814 987 6543',
    status: 'confirmed',
    createdAt: '2026-11-19T09:15:30Z',
  },
  {
    id: 'att-103',
    ticketId: 'EBZ-2026-92834',
    fullName: 'David Olawale',
    email: 'david.olawale@example.com',
    phone: '+234 701 555 0192',
    status: 'checked_in',
    createdAt: '2026-11-19T11:45:00Z',
    checkedInAt: '2026-11-19T12:00:00Z',
  },
  {
    id: 'att-104',
    ticketId: 'EBZ-2026-31456',
    fullName: 'Blessing Okafor',
    email: 'blessing.okafor@example.com',
    phone: '+234 816 333 4455',
    status: 'confirmed',
    createdAt: '2026-11-20T16:08:12Z',
  },
  {
    id: 'att-105',
    ticketId: 'EBZ-2026-44912',
    fullName: 'Joshua Babatunde',
    email: 'joshua.b@example.com',
    status: 'confirmed',
    createdAt: '2026-11-21T18:30:45Z',
  },
  {
    id: 'att-106',
    ticketId: 'EBZ-2026-88219',
    fullName: 'Sarah Chukwu',
    email: 'sarah.chukwu@example.com',
    phone: '+234 902 777 8899',
    status: 'confirmed',
    createdAt: '2026-11-22T08:12:00Z',
  },
]

function getStoredAttendees(): Attendee[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ATTENDEES))
      return SEED_ATTENDEES
    }
    return JSON.parse(raw) as Attendee[]
  } catch {
    return SEED_ATTENDEES
  }
}

function saveStoredAttendees(attendees: Attendee[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attendees))
  } catch (err) {
    console.error('Failed to save to localStorage:', err)
  }
}

function generateTicketId(): string {
  const randomDigits = Math.floor(10000 + Math.random() * 90000)
  return `EBZ-2026-${randomDigits}`
}

/**
 * Registers an attendee for the Ebenezer concert
 * @param payload Attendee full name, email, and optional phone number
 * @returns Promise with registration result, ticket ID, and attendee object
 */
export async function registerAttendee(payload: RegistrationPayload): Promise<RegistrationResponse> {
  // Simulate network latency (400ms - 800ms) for realistic UI loading state
  await new Promise((resolve) => setTimeout(resolve, 600))

  const cleanName = payload.fullName.trim()
  const cleanEmail = payload.email.trim().toLowerCase()
  const cleanPhone = payload.phone?.trim()

  // Basic validation guard
  if (!cleanName || cleanName.length < 2) {
    return {
      success: false,
      message: 'Please provide a valid full name.',
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    }
  }

  const attendees = getStoredAttendees()

  // Prevent duplicate registration for the same email
  const existing = attendees.find((a) => a.email === cleanEmail)
  if (existing) {
    return {
      success: true,
      ticketId: existing.ticketId,
      attendee: existing,
      message: 'You have already registered for EBENEZER! Here is your digital ticket pass.',
    }
  }

  const newAttendee: Attendee = {
    id: `att-${Date.now()}`,
    ticketId: generateTicketId(),
    fullName: cleanName,
    email: cleanEmail,
    phone: cleanPhone || undefined,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }

  const updated = [newAttendee, ...attendees]
  saveStoredAttendees(updated)

  return {
    success: true,
    ticketId: newAttendee.ticketId,
    attendee: newAttendee,
    message: 'Registration successful! Your free ticket pass is confirmed.',
  }
}
