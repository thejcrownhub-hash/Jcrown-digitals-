import Reveal from './Reveal.jsx'
import { useSiteContent } from '../lib/siteContent.jsx'

export default function DownloadCTA() {
  const { content } = useSiteContent()
  const cta = content?.cta

  return (
    <section id="download" className="py-24 md:py-32">
      <Reveal>
        <div className="container-x flex flex-col items-center text-center">
          <p className="eyebrow mb-4">{cta?.eyebrow}</p>
          <h2 className="max-w-3xl font-display text-3xl text-ivory md:text-4xl">
            {cta?.title}
          </h2>
          <p className="mt-4 max-w-2xl text-muted">{cta?.description}</p>
          <a href="#books" className="btn-gold mt-10 !px-10 !py-4 text-base">
            {cta?.button}
          </a>
        </div>
      </Reveal>
    </section>
  )
}
