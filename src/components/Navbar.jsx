import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from './Logo.jsx'
import { site } from '../lib/content.js'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Offers', href: '#offers' },
  { label: 'Books', href: '#books' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[70px] transition-all duration-300 ${
        scrolled ? 'border-b border-line bg-ink/90 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-full items-center justify-between">
        <Logo />

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-ivory transition-colors duration-200 hover:text-gold"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#/admin"
              className="rounded border border-gold/50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-gold transition-colors duration-200 hover:bg-gold/10"
            >
              Admin
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-ivory md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 top-[70px] z-40 bg-ink/95 md:hidden">
          <ul className="flex flex-col gap-6 px-8 py-10">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-ivory transition-colors hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#/admin"
                onClick={() => setOpen(false)}
                className="text-lg font-medium text-gold"
              >
                Admin
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
