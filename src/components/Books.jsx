import { useEffect, useState } from 'react'
import { BookOpen, Download, ShoppingBag } from 'lucide-react'
import Reveal from './Reveal.jsx'
import { fetchBooks } from '../lib/books.js'
import { useSiteContent } from '../lib/siteContent.jsx'

export default function Books() {
  const { content } = useSiteContent()
  const booksCopy = content?.books
  const owner = content?.site?.owner

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchBooks().then((res) => {
      if (cancelled) return
      setBooks(res.books || [])
      setError(res.error || null)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="books" className="py-24 md:py-32">
      <div className="container-x">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">Publications</p>
          <h2 className="mb-4 font-display text-3xl text-ivory md:text-4xl">
            {booksCopy?.title}
          </h2>
          <p className="text-muted">{booksCopy?.description}</p>
        </div>

        {loading ? (
          <p className="py-12 text-muted">Loading publications…</p>
        ) : books.length === 0 ? (
          <div className="rounded border border-line bg-panel p-12 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-gold/60" />
            <h3 className="font-display text-xl text-ivory">
              New publications are coming soon
            </h3>
            <p className="mt-2 text-sm text-muted">Check back soon for books by {owner}.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((b) => (
              <Reveal key={b.id}>
                <article className="group flex h-full flex-col overflow-hidden rounded border border-line bg-panel transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-[0_0_30px_rgba(201,168,76,0.15)]">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal">
                    {b.coverUrl ? (
                      <img
                        src={b.coverUrl}
                        alt={b.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-14 w-14 text-gold/50" />
                      </div>
                    )}
                    <span
                      className={`absolute left-3 top-3 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        b.isFree ? 'bg-gold text-ink' : 'bg-ink/80 text-ivory'
                      }`}
                    >
                      {b.format}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl text-ivory">{b.title}</h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">
                      {b.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gold">
                        {b.isFree ? 'Free' : `$${b.price.toFixed(2)}`}
                      </span>
                      {b.isFree && b.downloadUrl ? (
                        <a href={b.downloadUrl} className="btn-ghost !px-4 !py-2 text-xs">
                          <Download className="h-4 w-4" /> Download Free
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => alert('Checkout coming soon')}
                          className="btn-gold !px-4 !py-2 text-xs"
                        >
                          <ShoppingBag className="h-4 w-4" /> Get This Book
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}

        {error && <p className="mt-6 text-sm text-danger">Could not load books: {error.message}</p>}
      </div>
    </section>
  )
}
