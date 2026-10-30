import { Book, Gift, Sparkles } from 'lucide-react'
import Reveal from './Reveal.jsx'
import { useSiteContent } from '../lib/siteContent.jsx'

const ICONS = { book: Book, gift: Gift, sparkles: Sparkles }

export default function Offers() {
  const { content } = useSiteContent()
  const offers = content?.offers
  const features = offers?.features || []

  return (
    <section id="offers" className="py-24 md:py-32">
      <div className="container-x">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">What JCROWN offers</p>
          <h2 className="mb-4 font-display text-3xl text-ivory md:text-4xl">
            {offers?.title}
          </h2>
          <p className="text-muted">{offers?.description}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = ICONS[f.icon] || Book
            return (
              <Reveal key={i} delay={i * 120}>
                <div className="flex h-full flex-col items-start gap-4 rounded border border-line bg-panel p-8 transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-[0_0_30px_rgba(201,168,76,0.15)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="font-display text-xl text-ivory">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{f.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
