import { ChevronDown } from 'lucide-react'
import Logo, { CrownMark } from './Logo.jsx'
import { useSiteContent } from '../lib/siteContent.jsx'

export default function Hero() {
  const { content } = useSiteContent()
  const hero = content?.hero
  const site = content?.site

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      {/* premium background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.svg')" }}
      />

      <div className="container-x flex flex-col items-center text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <CrownMark className="h-9 w-9 text-gold" />
          <span className="font-display text-2xl font-semibold tracking-widest text-gold">
            {site?.name || 'JCROWN DIGITALS'}
          </span>
        </div>

        <p className="eyebrow mb-5">{hero?.eyebrow || 'Welcome to my digital library'}</p>

        <h1 className="max-w-4xl font-display text-4xl leading-tight text-ivory sm:text-5xl md:text-6xl">
          &ldquo;{hero?.quote}&rdquo;
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
          {hero?.tagline}
        </p>

        <a href="#about" className="btn-gold mt-10">
          Explore My Work
        </a>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/70 transition-colors hover:text-gold"
      >
        <ChevronDown className="h-7 w-7 animate-bounce" />
      </a>

      <div className="absolute bottom-24 left-8 hidden md:block opacity-30">
        <Logo />
      </div>
    </section>
  )
}
