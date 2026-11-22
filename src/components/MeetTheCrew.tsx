import { Users } from 'lucide-react'

// Automatically detect every image in public/images/crew/ dynamically
const crewGlob = import.meta.glob<string>('/public/images/crew/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

// Sort naturally by filename (e.g. aow.jpg, aow3.jpg ... aow9.jpg) and map to crew cards
const crew = Object.entries(crewGlob)
  .sort(([pathA], [pathB]) =>
    pathA.localeCompare(pathB, undefined, { numeric: true, sensitivity: 'base' })
  )
  .map(([filePath, assetUrl], index) => {
    const fileName = filePath.split('/').pop() || `member-${index + 1}`
    const imageUrl = assetUrl || filePath.replace(/^\/public/, '')
    return {
      id: `crew-${fileName}`,
      image: imageUrl,
      alt: 'Ebenezer Concert Crew Member',
    }
  })

export default function MeetTheCrew() {
  return (
    <section id="crew" className="relative py-24 sm:py-32 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background Concert Lighting Glows */}
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-900/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-fuchsia-900/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="animate-scroll-reveal text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-semibold mb-4">
            <Users className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>THE TEAM BEHIND THE ENCOUNTER</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase mb-4">
            Meet the{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Crew
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            The dedicated team serving with excellence, passion, and devotion to make EBENEZER 2026 an extraordinary and life-transforming experience.
          </p>
        </div>

        {/* Responsive Crew Gallery */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {crew.map((member) => (
            <div
              key={member.id}
              className="animate-scroll-reveal w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.5rem)] group relative"
            >
              <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900/80 border border-purple-900/40 group-hover:border-fuchsia-500/60 transition-all duration-500 shadow-xl shadow-purple-950/20 active:scale-95">
                {/* Crew Member Image */}
                <img
                  src={member.image}
                  alt={member.alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Subtle dark vignette overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"></div>

                {/* Top glow border on hover */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                {/* Bottom subtle brand emblem accent */}
                <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 px-2 py-0.5 rounded-full bg-slate-950/70 border border-purple-500/30 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="text-[9px] font-bold tracking-widest text-fuchsia-300 uppercase">
                    EBENEZER
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
