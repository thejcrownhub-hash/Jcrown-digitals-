import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase.js'
import * as defaults from './content.js'

/**
 * Merges rows from the `site_content` table over the static defaults in
 * content.js, so every section of the site is editable from the admin portal.
 * Values not yet saved in the DB fall back to the bundled copy.
 */
export function buildContent(dbMap = {}) {
  const ov = (key, field, fallback) => dbMap[key]?.[field] ?? fallback

  return {
    site: {
      name: ov('site', 'name', defaults.site.name),
      owner: ov('site', 'owner', defaults.site.owner),
    },
    hero: {
      eyebrow: ov('hero', 'eyebrow', 'Welcome to my digital library'),
      tagline: ov('hero', 'tagline', defaults.site.tagline),
      quote: ov('hero', 'quote', defaults.site.quote),
    },
    cta: {
      eyebrow: ov('cta', 'eyebrow', 'Your private library awaits'),
      title: ov('cta', 'title', 'Ready to start reading?'),
      description: ov(
        'cta',
        'description',
        'Download my digital books or browse free resources below.'
      ),
      button: ov('cta', 'button', 'Download Books Here'),
    },
    about: {
      title: ov('about', 'title', defaults.about.title),
      bio: [
        ov('about', 'bio0', defaults.about.bio[0]),
        ov('about', 'bio1', defaults.about.bio[1]),
        ov('about', 'bio2', defaults.about.bio[2]),
      ].filter(Boolean),
      portrait: ov('about', 'portrait', defaults.about.portrait),
    },
    offers: {
      title: ov('offers', 'title', defaults.offers.title),
      description: ov('offers', 'description', defaults.offers.description),
      features: defaults.offers.features.map((f, i) => ({
        title: ov('offers', `feat${i}_title`, f.title),
        description: ov('offers', `feat${i}_desc`, f.description),
        icon: ov('offers', `feat${i}_icon`, f.icon),
      })),
    },
    books: {
      title: ov('books', 'title', defaults.books.title),
      description: ov('books', 'description', defaults.books.description),
    },
    newsletter: {
      title: ov('newsletter', 'title', defaults.newsletter.title),
      description: ov('newsletter', 'description', defaults.newsletter.description),
    },
    contact: {
      title: ov('contact', 'title', defaults.contact.title),
      description: ov('contact', 'description', defaults.contact.description),
      email: ov('contact', 'email', defaults.contact.email),
    },
    footer: {
      socials:
        dbMap.footer?.socials && Array.isArray(dbMap.footer.socials) && dbMap.footer.socials.length
          ? dbMap.footer.socials
          : defaults.socials.map((s) => ({ name: s.name, url: s.url })),
    },
  }
}

const SiteContentContext = createContext(null)

/**
 * Loads editable content once and re-fetches whenever the admin saves
 * (listens for the 'jcrown-content-saved' window event).
 */
export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(() => buildContent())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const load = () => {
      if (!supabase) {
        setLoaded(true)
        return
      }
      supabase.from('site_content').select('*').then(({ data, error }) => {
        if (error || !data) {
          setLoaded(true)
          return
        }
        const map = {}
        for (const row of data) map[row.skey] = row.content
        setContent(buildContent(map))
        setLoaded(true)
      })
    }

    load()
    window.addEventListener('jcrown-content-saved', load)
    return () => window.removeEventListener('jcrown-content-saved', load)
  }, [])

  return (
    <SiteContentContext.Provider value={{ content, loaded }}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  return useContext(SiteContentContext)
}
