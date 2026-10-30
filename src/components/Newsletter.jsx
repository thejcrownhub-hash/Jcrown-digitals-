import { useState } from 'react'
import Reveal from './Reveal.jsx'
import { subscribeEmail } from '../lib/books.js'
import { useSiteContent } from '../lib/siteContent.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Newsletter() {
  const { content } = useSiteContent()
  const newsletter = content?.newsletter

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [message, setMessage] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }
    setStatus('sending')
    const res = await subscribeEmail(email.trim().toLowerCase())
    if (res.error) {
      setStatus('error')
      setMessage(res.error.message || 'Something went wrong. Please try again.')
    } else {
      setStatus('success')
      setMessage('Thank you for subscribing!')
      setEmail('')
    }
  }

  return (
    <section id="newsletter" className="py-24 md:py-32">
      <Reveal>
        <div className="container-x flex flex-col items-center text-center">
          <p className="eyebrow mb-3">Newsletter</p>
          <h2 className="max-w-2xl font-display text-3xl text-ivory md:text-4xl">
            {newsletter?.title}
          </h2>
          <p className="mt-4 max-w-xl text-muted">{newsletter?.description}</p>

          <form onSubmit={onSubmit} className="mt-8 flex w-full max-w-md gap-3" noValidate>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-dark flex-1"
              aria-label="Email address"
              required
            />
            <button type="submit" disabled={status === 'sending'} className="btn-gold whitespace-nowrap">
              {status === 'sending' ? 'Subscribing…' : 'Subscribe for Updates'}
            </button>
          </form>

          {status === 'success' && (
            <p className="mt-4 text-sm text-success" role="status">
              {message}
            </p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-sm text-danger" role="alert">
              {message}
            </p>
          )}
        </div>
      </Reveal>
    </section>
  )
}
