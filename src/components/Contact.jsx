import { useState } from 'react'
import { Mail } from 'lucide-react'
import Reveal from './Reveal.jsx'
import { submitContact } from '../lib/books.js'
import { useSiteContent } from '../lib/siteContent.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const INITIAL = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const { content } = useSiteContent()
  const contact = content?.contact

  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [serverError, setServerError] = useState('')

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Please enter your name.'
    if (!EMAIL_RE.test(form.email)) errs.email = 'Please enter a valid email.'
    if (!form.message.trim()) errs.message = 'Please enter a message.'
    return errs
  }

  async function onSubmit(e) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setStatus('sending')
    const res = await submitContact({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    })

    if (res.error) {
      setServerError(res.error.message || 'Failed to send. Please try again.')
      setStatus('error')
    } else {
      setForm(INITIAL)
      setStatus('success')
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="container-x grid gap-12 md:grid-cols-2">
        <Reveal>
          <p className="eyebrow mb-3">Get in touch</p>
          <h2 className="mb-4 font-display text-3xl text-ivory md:text-4xl">
            {contact?.title}
          </h2>
          <p className="text-muted">{contact?.description}</p>
          <div className="gold-divider my-6" />

          {contact?.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-gold"
            >
              <Mail className="h-4 w-4 text-gold" /> {contact.email}
            </a>
          )}
        </Reveal>

        <Reveal delay={120}>
          {status === 'success' ? (
            <div className="rounded border border-gold/40 bg-panel p-10 text-center">
              <h3 className="font-display text-2xl text-ivory">Message sent successfully</h3>
              <p className="mt-3 text-sm text-muted">
                Thanks for reaching out — I'll get back to you soon.
              </p>
              <button type="button" onClick={() => setStatus('idle')} className="btn-ghost mt-6">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="c-name" className="sr-only">Name</label>
                <input
                  id="c-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Your name"
                  className="input-dark"
                />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="c-email" className="sr-only">Email</label>
                <input
                  id="c-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="Your email"
                  className="input-dark"
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="c-subject" className="sr-only">Subject</label>
                <input
                  id="c-subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => set('subject', e.target.value)}
                  placeholder="Subject (optional)"
                  className="input-dark"
                />
              </div>
              <div>
                <label htmlFor="c-message" className="sr-only">Message</label>
                <textarea
                  id="c-message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                  placeholder="Your message"
                  className="input-dark resize-none"
                />
                {errors.message && <p className="field-error">{errors.message}</p>}
              </div>
              <button type="submit" disabled={status === 'sending'} className="btn-gold w-full">
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
              {status === 'error' && (
                <p className="text-sm text-danger" role="alert">
                  {serverError}
                </p>
              )}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
