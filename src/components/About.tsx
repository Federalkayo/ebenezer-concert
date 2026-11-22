import { Flame, Music, Sparkles, HeartHandshake, Shield } from 'lucide-react'

export default function About() {
  const pillars = [
    {
      icon: HeartHandshake,
      title: 'Worship',
      subtitle: 'Pure, Unfiltered Intimacy',
      description:
        'A sacred atmosphere free from distraction where thousands unite in one voice, laying down burdens and lifting praise to the Almighty.',
      accent: 'from-purple-500 to-indigo-500',
      badge: 'Spiritual Intimacy',
    },
    {
      icon: Music,
      title: 'Praise',
      subtitle: 'Triumphant Celebration',
      description:
        'Electrifying gospel sounds, thunderous drums, and high-energy rejoicing echoing across the city of Lagos as we celebrate God’s faithfulness.',
      accent: 'from-fuchsia-500 to-pink-500',
      badge: 'Unreserved Joy',
    },
    {
      icon: Flame,
      title: 'Encounter',
      subtitle: 'Life-Altering Transformation',
      description:
        'More than just a concert—a divine appointment. Experience breakthrough, spiritual renewal, and deep encounters that redefine purpose.',
      accent: 'from-amber-500 to-rose-500',
      badge: 'Holy Spirit Fire',
    },
  ]

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-purple-900/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-fuchsia-900/20 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>THE VISION BEHIND EBENEZER</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase mb-6">
            "Thus Far The Lord <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Has Helped Us"
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6 font-normal">
            Rooted in <span className="text-purple-300 font-semibold">1 Samuel 7:12</span>, EBENEZER represents a milestone of remembrance and gratitude. It is an altar of thanksgiving in Lagos, gathering believers from every walk of life to testify that our help comes from the Lord alone.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-purple-900/30 backdrop-blur-md max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 italic">
            "Then Samuel took a stone and set it up between Mizpah and Shen. He named it Ebenezer, saying, 'Thus far the LORD has helped us.'"
          </div>
        </div>

        {/* 3 Experience Pillars */}
        <div id="experience" className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon
            return (
              <div
                key={index}
                className="group relative flex flex-col justify-between p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 hover:border-purple-500/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 shadow-xl shadow-slate-950"
              >
                {/* Glow highlight */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.accent} p-0.5 shadow-lg shadow-purple-900/30`}
                    >
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-800/80 text-purple-300 border border-slate-700/60">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-wide">
                    {pillar.title}
                  </h3>
                  <h4 className="text-sm font-bold text-fuchsia-400 mb-3">
                    {pillar.subtitle}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs font-semibold text-purple-300">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Free &amp; Open to All</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
