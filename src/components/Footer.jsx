import Logo from './Logo.jsx'
import { useSiteContent } from '../lib/siteContent.jsx'

const QUICK_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Offers', href: '#offers' },
  { label: 'Books', href: '#books' },
  { label: 'Newsletter', href: '#newsletter' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const { content } = useSiteContent()
  const site = content?.site
  const socials = content?.footer?.socials || []

  return (
    <footer className="border-t border-line bg-charcoal/40">
      <div className="container-x flex flex-col gap-10 py-14 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Digital publications by {site?.owner}.
          </p>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Quick Links</h3>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-muted transition-colors hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Legal</h3>
          <ul className="space-y-2.5">
            <li>
              <a href="#" className="text-sm text-muted transition-colors hover:text-gold">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted transition-colors hover:text-gold">
                Terms
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Follow</h3>
          {socials.length === 0 ? (
            <p className="text-sm text-muted">Social links coming soon.</p>
          ) : (
            <ul className="space-y-2.5">
              {socials.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-muted transition-colors hover:text-gold"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-line/60 py-6 text-center text-xs text-muted/70">
        © {new Date().getFullYear()} {site?.name}. All rights reserved.
        <div className="mt-2">
          <a href="#/admin" className="text-gold/60 transition-colors hover:text-gold">
            Admin
          </a>
        </div>
      </div>
    </footer>
  )
}
