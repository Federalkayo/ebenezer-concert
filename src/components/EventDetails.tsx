import { Calendar, MapPin, Clock, Ticket, ShieldCheck, Users, HelpCircle, Bell } from 'lucide-react'

export default function EventDetails() {
  const details = [
    {
      icon: Calendar,
      title: 'Date',
      value: '29 November 2026',
      subtext: 'Sunday',
      badge: 'Save The Date',
      color: 'text-fuchsia-400',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Lagos, Nigeria',
      subtext: 'J & P Studio, Kosofe Bus Stop, beside Glass House',
      badge: 'Event Venue',
      color: 'text-purple-400',
    },
    {
      icon: Clock,
      title: 'Time',
      value: '4:00 PM–6:00 PM',
      subtext: 'West Africa Time (WAT)',
      badge: 'Event Time',
      color: 'text-indigo-400',
    },
    {
      icon: Ticket,
      title: 'Admission',
      value: '100% FREE',
      subtext: 'Registration Required for Pass',
      badge: 'Zero Fees',
      color: 'text-emerald-400',
    },
  ]

  const expectations = [
    {
      icon: ShieldCheck,
      title: 'Security & Safety',
      description:
        'Professional security personnel and medical emergency teams will be on-site throughout the event to ensure total safety.',
    },
    {
      icon: Users,
      title: 'Youth & Families Welcome',
      description:
        'Designed as a vibrant, multi-generational gathering welcoming young adults, students, and families from everywhere.',
    },
    {
      icon: Bell,
      title: 'Venue & Time',
      description:
        'Join us at J & P Studio, Kosofe Bus Stop, beside Glass House, from 4:00 PM to 6:00 PM WAT.',
    },
    {
      icon: HelpCircle,
      title: 'Digital Entry Pass',
      description:
        'Upon registering on this website, you will immediately receive your unique Digital Ticket Pass with a scannable barcode.',
    },
  ]

  return (
    <section id="details" className="relative py-24 sm:py-32 bg-slate-900/60 border-y border-purple-950/40 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="animate-scroll-reveal text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fuchsia-950/60 border border-fuchsia-500/30 text-fuchsia-300 text-xs sm:text-sm font-semibold mb-4">
            <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>EVENT INFORMATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase mb-4">
            Gathering Details
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Everything you need to plan your attendance for EBENEZER 2026.
          </p>
        </div>

        {/* 4 Key Details Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-16">
          {details.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="animate-scroll-reveal relative p-6 sm:p-8 rounded-3xl bg-slate-950/70 border border-purple-900/30 hover:border-fuchsia-500/50 active:scale-95 sm:hover:-translate-y-1 backdrop-blur-xl transition-all duration-300 shadow-lg shadow-purple-950/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                      {item.badge}
                    </span>
                  </div>

                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    {item.title}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-1 mb-1">
                    {item.value}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {item.subtext}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Important Attendee Guidelines */}
        <div className="animate-scroll-reveal rounded-3xl bg-slate-950/80 border border-slate-800/90 p-6 sm:p-12 backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-black text-white uppercase mb-2">
              What to Expect &amp; Attendee Guide
            </h3>
            <p className="text-sm text-slate-400">
              Clear information for a seamless and spiritually enriching experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {expectations.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 active:scale-[0.98] transition-transform"
                >
                  <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/40 text-purple-300 shrink-0">
                    <Icon className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
