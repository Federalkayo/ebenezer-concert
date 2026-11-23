import { useEffect, useRef, useState } from 'react'
import { Check, Copy, HeartHandshake } from 'lucide-react'

const ACCOUNT_NUMBER = '8120943176'

export default function SupportSection() {
  const [copyMessage, setCopyMessage] = useState('')
  const messageTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(messageTimer.current), [])

  const copyAccountNumber = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(ACCOUNT_NUMBER)
      } else {
        const input = document.createElement('textarea')
        input.value = ACCOUNT_NUMBER
        input.setAttribute('readonly', '')
        input.style.position = 'fixed'
        input.style.opacity = '0'
        document.body.appendChild(input)
        input.select()
        const copied = document.execCommand('copy')
        input.remove()
        if (!copied) throw new Error('Clipboard copy failed')
      }

      setCopyMessage('Account number copied!')
    } catch {
      setCopyMessage('Copy unavailable — please select the account number.')
    }

    window.clearTimeout(messageTimer.current)
    messageTimer.current = window.setTimeout(() => setCopyMessage(''), 2200)
  }

  return (
    <section id="support" className="relative bg-slate-950 px-4 py-16 text-slate-100 sm:py-20">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-700/10 blur-[110px]" />
      <div className="relative mx-auto max-w-4xl rounded-3xl border border-purple-900/40 bg-slate-900/70 p-6 shadow-xl shadow-purple-950/20 backdrop-blur sm:p-8">
        <div className="mx-auto mb-6 max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-950/50 px-3 py-1.5 text-xs font-semibold text-fuchsia-200">
            <HeartHandshake className="h-4 w-4 text-fuchsia-400" />
            Support the gathering
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">Support the Vision</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Partner with us to make this experience possible. Your financial support and sponsorship will help us make this concert a success.
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5">
            <dt className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Bank</dt>
            <dd className="mt-1 text-base font-bold text-white">PalmPay</dd>
          </div>

          <div className="rounded-2xl border border-purple-800/50 bg-slate-950/70 p-4 sm:p-5">
            <dt className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Account Number</dt>
            <dd className="mt-1 flex items-center justify-between gap-3">
              <span className="font-mono text-lg font-black tracking-wider text-purple-200 sm:text-xl">{ACCOUNT_NUMBER}</span>
              <button
                type="button"
                onClick={copyAccountNumber}
                aria-label="Copy account number"
                title="Copy account number"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-800/60 bg-purple-950/60 text-purple-200 transition hover:border-fuchsia-500/60 hover:bg-fuchsia-950/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
              >
                {copyMessage === 'Account number copied!' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </dd>
            <div className="mt-2 min-h-4 text-xs text-emerald-300" role="status" aria-live="polite">{copyMessage}</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:col-span-2 sm:p-5">
            <dt className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Account Name</dt>
            <dd className="mt-1 text-base font-bold text-white">Ogeleyinbo Idowu Omolara</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
