import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// Count down to the event date; the event time is still to be announced.
const TARGET_DATE = new Date('2026-11-29T00:00:00+01:00').getTime()

function calculateTimeLeft(): TimeLeft {
  const difference = TARGET_DATE - new Date().getTime()
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const items = [
    { label: 'Days', value: timeLeft.days, isSeconds: false },
    { label: 'Hours', value: timeLeft.hours, isSeconds: false },
    { label: 'Minutes', value: timeLeft.minutes, isSeconds: false },
    { label: 'Seconds', value: timeLeft.seconds, isSeconds: true },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className={`group relative flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-slate-900/70 border border-purple-500/20 backdrop-blur-xl shadow-xl shadow-purple-950/40 hover:border-fuchsia-500/40 active:scale-95 transition-all duration-300 ${
              item.isSeconds ? 'border-fuchsia-500/30' : ''
            }`}
          >
            {/* Top subtle highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/30 to-transparent"></div>

            <span
              className={`text-2xl sm:text-4xl md:text-5xl font-black font-sans tracking-tight text-white group-hover:scale-105 transition-transform ${
                item.isSeconds ? 'text-fuchsia-300 animate-second-tick' : ''
              }`}
            >
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-fuchsia-300/80 mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
