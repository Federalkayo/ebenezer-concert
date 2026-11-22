import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Mail, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { loginAdmin } from '../services/adminService'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.')
      return
    }

    setIsLoading(true)
    try {
      const res = await loginAdmin(email, password)
      if (res.success) {
        navigate('/admin')
      } else {
        setErrorMessage(res.error || 'Authentication failed.')
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred during login.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-purple-600 selection:text-white">
      {/* Background Volumetric Glows */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Return to website link */}
      <div className="w-full max-w-md mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to EBENEZER Website</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-purple-500/30 rounded-3xl p-8 sm:p-10 backdrop-blur-2xl shadow-2xl shadow-purple-950/60 relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-purple-600/30 border border-purple-500/40 mb-4 mx-auto">
            <img
              src="/images/logo.jpg"
              alt="EBENEZER Logo"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-wide">
            Admin Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            EBENEZER 2026 Organizer &amp; Staff Access
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ebenezer.org"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 text-white text-sm placeholder:text-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 text-white text-sm placeholder:text-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 shadow-lg shadow-purple-600/30 hover:shadow-fuchsia-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border border-fuchsia-400/30 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

      </div>
    </div>
  )
}
