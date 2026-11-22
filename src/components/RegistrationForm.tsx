import { useState, type FormEvent } from 'react'
import { Ticket, CheckCircle2, AlertCircle, Loader2, Download, Calendar, Sparkles, User, Mail, Phone, RefreshCw } from 'lucide-react'
import { registerAttendee } from '../services/registrationService'
import type { Attendee } from '../types'

export default function RegistrationForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [registeredAttendee, setRegisteredAttendee] = useState<Attendee | null>(null)

  // Field level validation errors
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({})

  const validate = (): boolean => {
    const newErrors: { fullName?: string; email?: string } = {}
    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name (minimum 2 characters).'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!validate()) return

    setIsLoading(true)
    try {
      const response = await registerAttendee({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      })

      if (response.success && response.attendee) {
        setRegisteredAttendee(response.attendee)
      } else {
        setErrorMessage(response.message || 'Registration failed. Please try again.')
      }
    } catch {
      setErrorMessage('A network error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setRegisteredAttendee(null)
    setFullName('')
    setEmail('')
    setPhone('')
    setErrors({})
    setErrorMessage(null)
  }

  const handlePrint = () => {
    window.print()
  }

  // Google Calendar Event Link
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=EBENEZER+Concert+2026&dates=20261129T160000Z/20261129T220000Z&details=EBENEZER:+An+Experience+of+Worship,+Praise+%26+Encounter.+Lagos,+Nigeria.+Ticket+ID:+${registeredAttendee?.ticketId || 'FREE'}&location=Lagos,+Nigeria`

  return (
    <section id="register" className="relative py-24 sm:py-32 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-fuchsia-600/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="animate-scroll-reveal text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-950/80 to-purple-950/80 border border-fuchsia-500/40 text-fuchsia-300 text-xs sm:text-sm font-semibold mb-4 shadow-lg shadow-fuchsia-950/40">
            <Ticket className="w-4 h-4 text-fuchsia-400" />
            <span>FREE ADMISSION • INSTANT CONFIRMATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase mb-4">
            Claim Your Free Ticket
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Reserve your spot for <span className="text-fuchsia-400 font-bold">EBENEZER 2026</span> in Lagos, Nigeria. Registration is 100% free and takes less than 30 seconds.
          </p>
        </div>

        {/* If Registered: Display E-Ticket Pass (Success State with entrance animation) */}
        {registeredAttendee ? (
          <div className="animate-ticket-reveal relative max-w-lg mx-auto bg-slate-900/90 border border-fuchsia-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-fuchsia-950/50">
            {/* Top Success Badge */}
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm mb-6 bg-emerald-950/40 border border-emerald-500/30 py-2 px-4 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span>Registration Confirmed! Digital Pass Ready</span>
            </div>

            {/* E-Ticket Card Design */}
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 border border-purple-500/30 p-6 overflow-hidden shadow-xl mb-6">
              {/* Ticket Watermark & Cutouts */}
              <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-28 h-28 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between border-b border-purple-900/50 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-fuchsia-500 to-indigo-600 flex items-center justify-center shadow-md">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-base font-black text-white tracking-wider uppercase">EBENEZER</span>
                    <span className="text-[10px] text-fuchsia-400 block font-semibold">ADMIT ONE • FREE PASS</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">TICKET NUMBER</span>
                  <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                    {registeredAttendee.ticketId}
                  </span>
                </div>
              </div>

              {/* Attendee Details */}
              <div className="space-y-3 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Attendee Name</span>
                  <div className="text-lg font-bold text-white capitalize">{registeredAttendee.fullName}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date</span>
                    <div className="font-semibold text-slate-200">29 November 2026</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Location</span>
                    <div className="font-semibold text-slate-200">Lagos, Nigeria</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Venue</span>
                    <div className="font-semibold text-slate-300">To Be Announced</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Time</span>
                    <div className="font-semibold text-slate-300">To Be Announced</div>
                  </div>
                </div>
              </div>

              {/* Barcode & Verification Stub */}
              <div className="pt-4 border-t border-dashed border-purple-800/60 flex items-center justify-between">
                <div>
                  <div className="flex gap-1 h-8 items-end opacity-80">
                    {[3, 1, 4, 2, 5, 2, 1, 4, 3, 2, 5, 1, 3, 4, 2, 1, 3, 5, 2, 4].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-white rounded-xs"
                        style={{ height: `${h * 6}px` }}
                      ></span>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 tracking-widest mt-1 block">
                    {registeredAttendee.ticketId}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-1 rounded">
                    VALIDATED
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-fuchsia-600 hover:bg-fuchsia-500 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-600/30 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save / Print Ticket</span>
              </button>

              <a
                href={calendarUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all border border-slate-700 flex items-center justify-center gap-2 text-center"
              >
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Add to Calendar</span>
              </a>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Register Another Attendee</span>
            </button>
          </div>
        ) : (
          /* Registration Form Card */
          <div className="animate-scroll-reveal relative max-w-xl mx-auto bg-slate-900/80 border border-purple-500/30 rounded-3xl p-7 sm:p-10 backdrop-blur-2xl shadow-2xl shadow-purple-950/50">
            {/* Top Border Glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/50 to-transparent"></div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-xs uppercase font-bold tracking-wider text-slate-300 mb-2">
                  Full Name <span className="text-fuchsia-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      if (errors.fullName) setErrors({ ...errors, fullName: undefined })
                    }}
                    placeholder="e.g. Emmanuel Adebayo"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950/90 border text-white text-sm placeholder:text-slate-500 focus:outline-none transition-all ${
                      errors.fullName
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                        : 'border-slate-800 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.fullName}</p>
                )}
              </div>

              {/* Email Address Field */}
              <div>
                <label htmlFor="email" className="block text-xs uppercase font-bold tracking-wider text-slate-300 mb-2">
                  Email Address <span className="text-fuchsia-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: undefined })
                    }}
                    placeholder="e.g. emmanuel@example.com"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950/90 border text-white text-sm placeholder:text-slate-500 focus:outline-none transition-all ${
                      errors.email
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                        : 'border-slate-800 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.email}</p>
                )}
                <p className="mt-1.5 text-[11px] text-slate-500">
                  Your digital ticket pass and venue updates will be sent here.
                </p>
              </div>

              {/* Phone Number Field (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="phone" className="block text-xs uppercase font-bold tracking-wider text-slate-300">
                    Phone Number
                  </label>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                    Optional
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 text-white text-sm placeholder:text-slate-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group overflow-hidden py-4 px-6 rounded-2xl font-black text-base text-white bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 shadow-[0_0_35px_rgba(192,38,211,0.4)] hover:shadow-[0_0_50px_rgba(192,38,211,0.7)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-fuchsia-400/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>GENERATING YOUR PASS...</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-5 h-5 text-fuchsia-200" />
                    <span>REGISTER FOR FREE NOW</span>
                  </>
                )}
                <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>

              <div className="text-center text-[11px] text-slate-500">
                By registering, you confirm your attendance for EBENEZER 2026. Zero registration fees.
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}
