import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Offers from './components/Offers.jsx'
import DownloadCTA from './components/DownloadCTA.jsx'
import Books from './components/Books.jsx'
import Newsletter from './components/Newsletter.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Admin from './components/Admin.jsx'
import { SiteContentProvider } from './lib/siteContent.jsx'

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false)

  // Hash routing: '#/admin' renders the admin portal
  useEffect(() => {
    const checkRoute = () => {
      const hash = window.location.hash || ''
      setIsAdminRoute(hash.startsWith('#/admin'))
    }
    checkRoute()
    window.addEventListener('hashchange', checkRoute)
    return () => window.removeEventListener('hashchange', checkRoute)
  }, [])

  if (isAdminRoute) return <Admin />

  return (
    <SiteContentProvider>
      <div id="top" className="min-h-screen bg-ink">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Offers />
          <DownloadCTA />
          <Books />
          <Newsletter />
          <Contact />
        </main>
        <Footer />
      </div>
    </SiteContentProvider>
  )
}
