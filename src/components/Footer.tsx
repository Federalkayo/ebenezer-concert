import { Heart, MapPin, Calendar, Clock, Mail } from 'lucide-react'

export default function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative bg-slate-950 border-t border-purple-950/50 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          {/* Brand & Vision */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md border border-purple-500/30">
                <img
                  src="/images/logo.jpg"
                  alt="EBENEZER Logo"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <span className="text-2xl font-black tracking-wider text-white uppercase font-sans">
                EBENEZER
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              An Experience of Worship, Praise &amp; Encounter. Uniting generations across Lagos to proclaim that thus far, the LORD has helped us.
            </p>

            <div className="text-xs text-purple-300 font-mono italic">
              "Thus far the LORD has helped us." — 1 Samuel 7:12
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => scrollTo('about')}
                  className="hover:text-fuchsia-400 transition-colors cursor-pointer text-left"
                >
                  About the Gathering
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('experience')}
                  className="hover:text-fuchsia-400 transition-colors cursor-pointer text-left"
                >
                  The Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('details')}
                  className="hover:text-fuchsia-400 transition-colors cursor-pointer text-left"
                >
                  Event Details
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('register')}
                  className="hover:text-fuchsia-400 transition-colors cursor-pointer text-left"
                >
                  Register for Free
                </button>
              </li>
            </ul>
          </div>

          {/* Event Summary */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-white mb-4">
              Event Info
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>29 November 2026</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>J &amp; P Studio, Kosofe Bus Stop, beside Glass House</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>4:00 PM–6:00 PM WAT</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>info@ebenezerconcert.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 EBENEZER Concert. All rights reserved. Entry is 100% Free.
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Built for an encounter in</span>
            <Heart className="w-3 h-3 text-fuchsia-500 fill-fuchsia-500 inline" />
            <span>Lagos, Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
