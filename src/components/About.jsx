import { BookOpen } from 'lucide-react'
import Reveal from './Reveal.jsx'
import { useSiteContent } from '../lib/siteContent.jsx'

export default function About() {
  const { content } = useSiteContent()
  const about = content?.about

  const bio = about?.bio || []
  const title = about?.title || 'Meet Jediah Akeredolu'
  const portrait = about?.portrait || null

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="container-x grid items-center gap-12 md:grid-cols-[2fr_3fr]">
        <Reveal>
          <div className="mx-auto flex h-72 w-72 items-center justify-center rounded border border-gold/40 bg-panel p-10 md:h-80 md:w-80">
            {portrait ? (
              <img
                src={portrait}
                alt="Jediah Akeredolu portrait"
                className="h-full w-full rounded object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-center text-muted">
                <BookOpen className="h-16 w-16 text-gold/60" />
                <span className="text-sm">Portrait coming soon</span>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="eyebrow mb-3">The person behind the brand</p>
          <h2 className="mb-6 font-display text-3xl text-ivory md:text-4xl">{title}</h2>
          <div className="gold-divider mb-6" />
          <div className="space-y-5">
            {bio.map((para, i) => (
              <p key={i} className="leading-relaxed text-muted">
                {para}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
