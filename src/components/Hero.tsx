import { Calendar, MapPin, Sparkles, Ticket, ArrowRight, ShieldCheck } from 'lucide-react'
import Countdown from './Countdown'

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="hero relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
      {/* Concert stage atmospheric lighting accents (Purple, Pink & Cyan) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-fuchsia-950/20 to-transparent mix-blend-screen"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-purple-600/15 rounded-full blur-[150px]"></div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Announcement Pill */}
        <div className="animate-hero-badge inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-fuchsia-500/30 backdrop-blur-md shadow-lg shadow-fuchsia-950/50 mb-6 hover:border-fuchsia-500/60 transition-all">
          <span className="flex h-2 w-2 rounded-full bg-fuchsia-400 animate-ping"></span>
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-fuchsia-200 uppercase">
            ✦ The Annual Gathering • Lagos, Nigeria
          </span>
        </div>

        {/* Main Headline: EBENEZER */}
        <h1 className="animate-hero-title text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white uppercase drop-shadow-[0_10px_35px_rgba(168,85,247,0.35)] leading-none mb-3">
          EBENEZER
        </h1>

        {/* Tagline / Subtitle */}
        <h2 className="animate-hero-subtitle text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-purple-300 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent max-w-4xl mb-6">
          An Experience of Worship, Praise &amp; Encounter.
        </h2>

        {/* Supportive Description */}
        <p className="animate-hero-desc text-slate-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed drop-shadow">
          Join thousands of passionate worshippers for an unforgettable night of divine intimacy, triumphant praise, and life-transforming encounters in God's presence.
        </p>

        {/* Event Key Details Bar */}
        <div className="animate-hero-details flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-10 text-xs sm:text-sm font-semibold text-slate-200">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md active:scale-95 transition-transform">
            <Calendar className="w-4 h-4 text-fuchsia-400" />
            <span>29 November 2026</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md active:scale-95 transition-transform">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span>Lagos, Nigeria</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-fuchsia-950/60 border border-fuchsia-700/50 text-fuchsia-300 backdrop-blur-md active:scale-95 transition-transform">
            <Ticket className="w-4 h-4 text-fuchsia-300" />
            <span>Entry: 100% FREE</span>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="animate-hero-countdown w-full mb-10">
          <Countdown />
        </div>

        {/* Large Attractive CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => scrollTo('register')}
            className="animate-hero-cta w-full sm:w-auto relative group overflow-hidden px-8 py-4 rounded-2xl font-black text-base sm:text-lg text-white bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer border border-fuchsia-300/40"
          >
            <Ticket className="w-5 h-5 text-fuchsia-200" />
            <span>GET YOUR FREE TICKET</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>

          <button
            onClick={() => scrollTo('details')}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl font-bold text-base text-slate-200 bg-slate-900/70 hover:bg-slate-800/90 border border-purple-500/30 hover:border-purple-400/60 active:scale-95 backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-950/30"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>EVENT DETAILS</span>
          </button>
        </div>

        {/* Assurance micro-copy */}
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero ticket fees • Instant digital pass upon registration</span>
        </div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
    </section>
  )
}
