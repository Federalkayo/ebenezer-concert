import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Ticket, ShieldCheck } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    if (!isHomePage) {
      window.location.href = `/#${id}`
      return
    }
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-purple-900/30 shadow-2xl shadow-purple-950/40 py-3.5'
          : 'bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 rounded-lg p-1 active:scale-95 transition-transform"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-purple-500/25 border border-purple-500/30 group-hover:scale-105 group-hover:border-fuchsia-400/60 transition-all duration-300">
              <img
                src="/images/logo.jpg"
                alt="EBENEZER Logo"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase font-sans">
                  EBENEZER
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                  2026
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-medium">
                Lagos, Nigeria
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('about')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              The Experience
            </button>
            <button
              onClick={() => scrollToSection('details')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              Event Details
            </button>
            <button
              onClick={() => scrollToSection('register')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              Get Free Pass
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/admin/login"
              title="Admin Portal"
              className="p-2 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-purple-950/40 border border-transparent hover:border-purple-800/40 active:scale-95 transition-all text-xs font-medium flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs">Admin</span>
            </Link>

            <button
              onClick={() => scrollToSection('register')}
              className="relative group overflow-hidden px-5 py-2.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 shadow-lg shadow-purple-600/30 hover:shadow-fuchsia-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer border border-fuchsia-400/30"
            >
              <Ticket className="w-4 h-4 text-fuchsia-200" />
              <span>FREE REGISTRATION</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => scrollToSection('register')}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-fuchsia-600 to-purple-600 shadow-sm active:scale-95 transition-transform"
            >
              Free Ticket
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/60 border border-slate-800 focus:outline-none active:scale-90 transition-transform"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with Entrance Animation */}
      {mobileMenuOpen && (
        <div className="animate-mobile-drawer md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-purple-900/40 px-6 py-6 shadow-2xl transition-all">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => scrollToSection('about')}
              className="text-left text-base font-medium text-slate-200 hover:text-fuchsia-400 py-2 border-b border-slate-900 active:translate-x-1 transition-transform"
            >
              About the Gathering
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className="text-left text-base font-medium text-slate-200 hover:text-fuchsia-400 py-2 border-b border-slate-900 active:translate-x-1 transition-transform"
            >
              The Experience
            </button>
            <button
              onClick={() => scrollToSection('details')}
              className="text-left text-base font-medium text-slate-200 hover:text-fuchsia-400 py-2 border-b border-slate-900 active:translate-x-1 transition-transform"
            >
              Event Details
            </button>
            <button
              onClick={() => scrollToSection('register')}
              className="text-left text-base font-medium text-slate-200 hover:text-fuchsia-400 py-2 border-b border-slate-900 active:translate-x-1 transition-transform"
            >
              Register for Free
            </button>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => scrollToSection('register')}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-fuchsia-600 to-indigo-600 shadow-lg text-center flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Ticket className="w-4 h-4" />
                GET YOUR FREE TICKET
              </button>

              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-xs text-slate-400 hover:text-slate-200 py-2 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Dashboard Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
