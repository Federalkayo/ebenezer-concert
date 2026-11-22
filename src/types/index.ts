export interface Attendee {
  id: string
  ticketId: string
  fullName: string
  email: string
  phone?: string
  status: 'confirmed' | 'checked_in' | 'cancelled'
  emailStatus: 'pending' | 'sent' | 'failed'
  createdAt: string
  checkedInAt?: string
}

export interface RegistrationPayload {
  fullName: string
  email: string
  phone?: string
}

export interface RegistrationResponse {
  success: boolean
  ticketId?: string
  attendee?: Attendee
  message?: string
  duplicate?: boolean
}

export interface DashboardStats {
  totalRegistrations: number
  checkedInCount: number
  confirmedCount: number
  daysRemaining: number
  venueCapacity: number
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'organizer'
}
