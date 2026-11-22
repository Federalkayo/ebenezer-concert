import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Users,
  CheckCircle,
  Calendar,
  Search,
  Download,
  LogOut,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Eye,
  X,
  UserCheck,
  UserX,
  Ticket,
  Clock
} from 'lucide-react'
import {
  getAdminSession,
  logoutAdmin,
  getAttendees,
  getDashboardStats,
  updateAttendeeStatus,
  exportAttendeesToCSV
} from '../services/adminService'
import type { Attendee, DashboardStats, AdminUser } from '../types'

export default function AdminDashboard() {
  const navigate = useNavigate()
  // Initialize admin user directly from session to prevent setState-in-effect
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Modal State for Attendee Details
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [fetchedStats, fetchedAttendees] = await Promise.all([
        getDashboardStats(),
        getAttendees(searchQuery, statusFilter)
      ])
      setStats(fetchedStats)
      setAttendees(fetchedAttendees)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, statusFilter])

  // Verify Admin Session and load data
  useEffect(() => {
    let active = true
    getAdminSession().then((user) => {
      if (!active) return
      setAdminUser(user)
      setAuthChecked(true)
      if (!user) navigate('/admin/login')
    }).catch(() => {
      if (!active) return
      setAuthChecked(true)
      navigate('/admin/login')
    })
    return () => { active = false }
  }, [navigate])

  useEffect(() => {
    if (!authChecked || !adminUser) return
    const timer = setTimeout(() => { void loadData() }, 0)
    return () => clearTimeout(timer)
  }, [authChecked, adminUser, loadData])

  const handleLogout = () => {
    void logoutAdmin()
    navigate('/admin/login')
  }

  const handleToggleCheckIn = async (attendee: Attendee) => {
    const nextStatus = attendee.status === 'checked_in' ? 'confirmed' : 'checked_in'
    const updated = await updateAttendeeStatus(attendee.id, nextStatus)
    if (updated) {
      setAttendees((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
      if (selectedAttendee?.id === updated.id) {
        setSelectedAttendee(updated)
      }
      // Refresh stats count
      getDashboardStats().then(setStats)
    }
  }

  const handleExportCSV = () => {
    exportAttendeesToCSV(attendees)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Top Admin Navbar */}
      <header className="bg-slate-900/90 border-b border-purple-900/30 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-md border border-purple-500/30 group-hover:border-fuchsia-400/60 transition-colors">
                <img
                  src="/images/logo.jpg"
                  alt="EBENEZER Logo"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <span className="text-lg font-black tracking-wider text-white uppercase">
                EBENEZER
              </span>
            </Link>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/70 text-purple-300 border border-purple-800/40 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Organizer Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white py-1.5 px-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="hidden md:flex flex-col text-right pr-2">
              <span className="text-xs font-bold text-slate-200">{adminUser?.name || 'Admin'}</span>
              <span className="text-[10px] text-slate-400">{adminUser?.email}</span>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Event Registrations
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time attendee roster for EBENEZER Concert • 29 November 2026, Lagos, Nigeria.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-fuchsia-400' : ''}`} />
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 shadow-lg shadow-purple-900/30 flex items-center gap-2 cursor-pointer transition-all border border-fuchsia-400/30"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Total Registrations */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-purple-900/30 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-bold text-slate-400">Total Registered</span>
                <div className="p-2 rounded-lg bg-purple-950/80 text-fuchsia-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-white">{stats.totalRegistrations}</div>
              <div className="text-[11px] text-fuchsia-300/80 mt-1 font-medium">
                {Math.round((stats.totalRegistrations / stats.venueCapacity) * 100)}% of {stats.venueCapacity.toLocaleString()} estimated capacity
              </div>
            </div>

            {/* Confirmed Passes */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-purple-900/30 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-bold text-slate-400">Confirmed Passes</span>
                <div className="p-2 rounded-lg bg-indigo-950/80 text-indigo-400">
                  <Ticket className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-white">{stats.confirmedCount}</div>
              <div className="text-[11px] text-indigo-300/80 mt-1 font-medium">
                Digital tickets generated
              </div>
            </div>

            {/* Gate Checked In */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-purple-900/30 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-bold text-slate-400">Gate Checked In</span>
                <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-white">{stats.checkedInCount}</div>
              <div className="text-[11px] text-emerald-300/80 mt-1 font-medium">
                {stats.totalRegistrations > 0
                  ? `${Math.round((stats.checkedInCount / stats.totalRegistrations) * 100)}% check-in rate`
                  : 'Ready for Event Day'}
              </div>
            </div>

            {/* Days Remaining */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-purple-900/30 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-bold text-slate-400">Countdown</span>
                <div className="p-2 rounded-lg bg-amber-950/80 text-amber-400">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-white">{stats.daysRemaining} Days</div>
              <div className="text-[11px] text-amber-300/80 mt-1 font-medium">
                Until 29 November 2026
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Field */}
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none transition-all"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'checked_in', label: 'Checked In' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Attendee Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="py-4 px-4 sm:px-6">Registration Reference</th>
                  <th className="py-4 px-4 sm:px-6">Attendee</th>
                  <th className="py-4 px-4 sm:px-6 hidden md:table-cell">Phone</th>
                  <th className="py-4 px-4 sm:px-6">Email</th>
                  <th className="py-4 px-4 sm:px-6">Check-in</th>
                  <th className="py-4 px-4 sm:px-6 hidden lg:table-cell">Registered</th>
                  <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {attendees.length > 0 ? (
                  attendees.map((attendee) => (
                    <tr
                      key={attendee.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Ticket ID */}
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-purple-300">
                        {attendee.ticketId}
                      </td>

                      {/* Attendee Info */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-bold text-white capitalize">{attendee.fullName}</div>
                        <div className="text-xs text-slate-400">{attendee.email}</div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 sm:px-6 hidden md:table-cell text-slate-300 font-mono text-xs">
                        {attendee.phone || <span className="text-slate-600">N/A</span>}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 sm:px-6">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${attendee.emailStatus === 'sent' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50' : attendee.emailStatus === 'failed' ? 'bg-rose-950/80 text-rose-300 border-rose-800/50' : 'bg-amber-950/80 text-amber-300 border-amber-800/50'}`}>
                          {attendee.emailStatus || 'pending'}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        {attendee.status === 'checked_in' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                            <CheckCircle className="w-3 h-3" />
                            Checked In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/50">
                            <Clock className="w-3 h-3" />
                            Confirmed
                          </span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="py-4 px-4 sm:px-6 hidden lg:table-cell text-xs text-slate-400">
                        {new Date(attendee.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedAttendee(attendee)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            title="View Ticket Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleCheckIn(attendee)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              attendee.status === 'checked_in'
                                ? 'text-amber-400 hover:bg-amber-950/40'
                                : 'text-emerald-400 hover:bg-emerald-950/40'
                            }`}
                            title={attendee.status === 'checked_in' ? 'Undo Check-in' : 'Mark as Checked In'}
                          >
                            {attendee.status === 'checked_in' ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No attendees found matching "{searchQuery}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Attendee Details Modal */}
      {selectedAttendee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedAttendee(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950 px-2.5 py-1 rounded border border-purple-800">
                {selectedAttendee.ticketId}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  selectedAttendee.status === 'checked_in'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-purple-950 text-purple-300 border border-purple-800'
                }`}
              >
                {selectedAttendee.status === 'checked_in' ? 'CHECKED IN' : 'CONFIRMED PASS'}
              </span>
            </div>

            <h3 className="text-2xl font-black text-white capitalize mb-1">
              {selectedAttendee.fullName}
            </h3>
            <p className="text-sm text-slate-400 mb-6">{selectedAttendee.email}</p>

            <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-3 text-xs mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="font-semibold text-slate-200">{selectedAttendee.phone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registration Timestamp:</span>
                <span className="font-semibold text-slate-200">
                  {new Date(selectedAttendee.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Confirmation Email:</span>
                <span className={`font-semibold ${selectedAttendee.emailStatus === 'failed' ? 'text-rose-400' : selectedAttendee.emailStatus === 'sent' ? 'text-emerald-400' : 'text-amber-300'}`}>
                  {selectedAttendee.emailStatus || 'pending'}
                </span>
              </div>
              {selectedAttendee.checkedInAt && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Checked-in At:</span>
                  <span className="font-semibold text-emerald-400">
                    {new Date(selectedAttendee.checkedInAt).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Event:</span>
                <span className="font-semibold text-slate-200">EBENEZER Concert (29 Nov 2026)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Admission Fee:</span>
                <span className="font-semibold text-emerald-400">100% FREE</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleToggleCheckIn(selectedAttendee)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedAttendee.status === 'checked_in'
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {selectedAttendee.status === 'checked_in' ? (
                  <>
                    <UserX className="w-4 h-4" />
                    <span>Undo Check-in</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Mark as Checked In</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedAttendee(null)}
                className="py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
