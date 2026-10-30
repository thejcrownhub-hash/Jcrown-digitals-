import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users as UsersIcon,
  Mail,
  LogOut,
  Lock,
  Settings,
} from 'lucide-react'
import Logo, { CrownMark } from './Logo.jsx'
import { buildContent } from '../lib/siteContent.jsx'
import {
  loginAdmin,
  logoutAdmin,
  isAdminAuthed,
  fetchSiteContent,
  saveSiteContent,
} from '../lib/admin.js'
import {
  fetchAllBooks,
  createBook,
  updateBook,
  deleteBook,
  fetchSubscribers,
  deleteSubscriber,
  fetchMessages,
  markMessageRead,
  deleteMessage,
} from '../lib/admin.js'

export const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'content', label: 'Site Content', icon: Settings },
  { id: 'about', label: 'About Editor', icon: FileText },
  { id: 'books', label: 'Books', icon: BookOpen },
  { id: 'users', label: 'Users', icon: UsersIcon },
  { id: 'subscribers', label: 'Subscribers', icon: UsersIcon },
  { id: 'messages', label: 'Messages', icon: Mail },
]

export default function Admin() {
  const [authed, setAuthed] = useState(isAdminAuthed())
  const [tab, setTab] = useState('overview')

  function handleLogout() {
    logoutAdmin()
    setAuthed(false)
  }

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />
  }

  return (
    <div className="min-h-screen bg-ink text-ivory">
      <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur-sm">
        <div className="container-x flex h-16 items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <CrownMark className="h-6 w-6 text-gold" />
            <span className="font-display text-lg font-semibold tracking-wide text-gold">
              Admin Portal
            </span>
          </a>
          <div className="flex items-center gap-4">
            <a href="#top" className="text-sm text-muted transition-colors hover:text-gold">
              View site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded border border-gold/50 px-3 py-1.5 text-sm text-gold transition-colors hover:bg-gold/10"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </div>
      </header>

      <div className="container-x flex flex-col gap-8 py-8 md:flex-row">
        <aside className="md:w-56 md:shrink-0">
          <nav className="flex gap-2 overflow-x-auto md:flex-col">
            {TABS.map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex shrink-0 items-center gap-3 rounded px-4 py-2.5 text-sm font-medium transition-colors ${
                    tab === t.id
                      ? 'bg-gold text-ink'
                      : 'text-muted hover:bg-charcoal hover:text-ivory'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {t.label}
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          {tab === 'overview' && (
            <Overview onNavigate={setTab} />
          )}
          {tab === 'content' && (
            <ContentManager />
          )}
          {tab === 'about' && (
            <AboutEditor />
          )}
          {tab === 'books' && (
            <BooksManager />
          )}
          {tab === 'subscribers' && (
            <Subscribers />
          )}
          {tab === 'users' && (
            <Users />
          )}
          {tab === 'messages' && (
            <Messages />
          )}
        </main>
      </div>
    </div>
  )
}

/* ============ Login ============ */
function Login({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  function onSubmit(e) {
    e.preventDefault()
    if (loginAdmin(password)) {
      setError(null)
      onSuccess()
    } else {
      setError('Incorrect admin password.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/background.svg')" }}
      />
      <div className="w-full max-w-sm rounded border border-line bg-panel p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <CrownMark className="h-8 w-8 text-gold" />
          <div>
            <h1 className="font-display text-xl text-ivory">Admin Login</h1>
            <p className="mt-1 text-xs text-muted">JCROWN DIGITALS</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="pw" className="sr-only">Admin password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="input-dark pl-9"
              />
            </div>
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button type="submit" className="btn-gold w-full">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-[11px] text-muted/70">
          Password set via VITE_ADMIN_PASSWORD in .env
        </p>
      </div>
    </div>
  )
}

/* ============ Overview ============ */
function Overview({ onNavigate }) {
  const [stats, setStats] = useState({ books: 0, subscribers: 0, messages: 0 })

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchAllBooks(), fetchSubscribers(), fetchMessages()]).then(
      ([b, s, m]) => {
        if (cancelled) return
        setStats({
          books: b.books?.length || 0,
          subscribers: s.subscribers?.length || 0,
          messages: m.messages?.length || 0,
        })
      }
    )
    return () => {
      cancelled = true
    }
  }, [])

  const cards = [
    { label: 'Books', value: stats.books, icon: BookOpen, tab: 'books' },
    { label: 'Subscribers', value: stats.subscribers, icon: UsersIcon, tab: 'subscribers' },
    { label: 'Messages', value: stats.messages, icon: Mail, tab: 'messages' },
  ]

  return (
    <section>
      <h2 className="mb-6 font-display text-2xl text-ivory">Overview</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <button
              key={c.label}
              onClick={() => onNavigate(c.tab)}
              className="rounded border border-line bg-panel p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-gold"
            >
              <Icon className="mb-3 h-6 w-6 text-gold" />
              <div className="font-display text-3xl text-ivory">{c.value}</div>
              <div className="text-sm text-muted">{c.label}</div>
            </button>
          )
        })}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <button
          onClick={() => onNavigate('about')}
          className="rounded border border-gold/40 bg-panel p-6 text-left transition-colors hover:bg-charcoal"
        >
          <FileText className="mb-2 h-5 w-5 text-gold" />
          <div className="font-medium text-ivory">Edit About / Bio</div>
          <div className="text-sm text-muted">
            Write about yourself and update your bio.
          </div>
        </button>
        <button
          onClick={() => onNavigate('books')}
          className="rounded border border-gold/40 bg-panel p-6 text-left transition-colors hover:bg-charcoal"
        >
          <BookOpen className="mb-2 h-5 w-5 text-gold" />
          <div className="font-medium text-ivory">Manage Books</div>
          <div className="text-sm text-muted">Add, edit, publish, or delete books.</div>
        </button>
      </div>
    </section>
  )
}

/* ============ About Editor (write about yourself) ============ */
function AboutEditor() {
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [portrait, setPortrait] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchSiteContent().then((res) => {
      if (cancelled) return
      const about = res.data?.about || {}
      setTitle(about.title || 'Meet Jediah Akeredolu')
      setBio(
        [about.bio0, about.bio1, about.bio2]
          .filter(Boolean)
          .join('\n\n') || ''
      )
      setPortrait(about.portrait || '')
    })
    return () => {
      cancelled = true
    }
  }, [])

  async function onSave(e) {
    e.preventDefault()
    setStatus('saving')
    const paras = bio.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    const content = {
      title: title.trim() || 'Meet Jediah Akeredolu',
      bio0: paras[0] || '',
      bio1: paras[1] || '',
      bio2: paras[2] || '',
      portrait: portrait.trim() || null,
    }
    const res = await saveSiteContent('about', content)
    if (res.error) {
      setStatus('idle')
      setMessage(`Save failed: ${res.error.message}`)
    } else {
      setStatus('idle')
      setMessage('About content saved. It will appear on the homepage.')
    }
  }

  return (
    <section>
      <h2 className="mb-2 font-display text-2xl text-ivory">About Editor</h2>
      <p className="mb-6 text-sm text-muted">
        Write about yourself. This updates the About section on the homepage.
      </p>
      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-muted">Section title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-dark"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">
            Biography (separate paragraphs with a blank line)
          </label>
          <textarea
            rows={8}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input-dark resize-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">
            Portrait URL (optional, e.g. /portrait.jpg)
          </label>
          <input
            value={portrait}
            onChange={(e) => setPortrait(e.target.value)}
            placeholder="/portrait.jpg"
            className="input-dark"
          />
        </div>
        <button type="submit" disabled={status === 'saving'} className="btn-gold">
          {status === 'saving' ? 'Saving…' : 'Save About Content'}
        </button>
        {message && (
          <p className="text-sm text-success" role="status">
            {message}
          </p>
        )}
      </form>
    </section>
  )
}

/* ============ Books Manager (CRUD) ============ */
const EMPTY_BOOK = {
  title: '',
  description: '',
  author: 'Jediah Akeredolu',
  cover_image: '',
  file_path: '',
  file_format: 'PDF',
  price: 0,
  is_free: true,
  is_published: false,
}

function BooksManager() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_BOOK)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  function reload() {
    setLoading(true)
    fetchAllBooks().then((res) => {
      setBooks(res.books || [])
      setLoading(false)
    })
  }

  useEffect(reload, [])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function resetForm() {
    setForm(EMPTY_BOOK)
    setEditingId(null)
  }

  async function onSave(e) {
    e.preventDefault()
    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      author: form.author.trim() || 'Jediah Akeredolu',
      price: Number(form.price) || 0,
      is_free: form.is_free,
      is_published: form.is_published,
    }
    setStatus('saving')
    const res = editingId
      ? await updateBook(editingId, payload)
      : await createBook(payload)
    setStatus('idle')
    if (res.error) {
      setMessage(`Save failed: ${res.error.message}`)
    } else {
      setMessage(editingId ? 'Book updated.' : 'Book created.')
      resetForm()
      reload()
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Delete this book permanently?')) return
    const res = await deleteBook(id)
    if (res.error) {
      setMessage(`Delete failed: ${res.error.message}`)
    } else {
      reload()
    }
  }

  function onEdit(b) {
    setEditingId(b.id)
    setForm({
      title: b.title || '',
      description: b.description || '',
      author: b.author || 'Jediah Akeredolu',
      cover_image: b.cover_image || '',
      file_path: b.file_path || '',
      file_format: b.file_format || 'PDF',
      price: b.price || 0,
      is_free: b.is_free,
      is_published: b.is_published,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-ivory">Books Management</h2>
        <button onClick={resetForm} className="btn-ghost !px-4 !py-2 text-xs">
          + New Book
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={onSave}
        className="mb-8 rounded border border-gold/40 bg-panel p-6"
      >
        <h3 className="mb-4 font-display text-lg text-ivory">
          {editingId ? 'Edit Book' : 'Add Book'}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-muted">Title *</label>
            <input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="input-dark"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-muted">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className="input-dark resize-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Author</label>
            <input
              value={form.author}
              onChange={(e) => set('author', e.target.value)}
              className="input-dark"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Format (PDF, EPUB…)</label>
            <input
              value={form.file_format}
              onChange={(e) => set('file_format', e.target.value.toUpperCase())}
              className="input-dark"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">
              Cover URL (or storage path)
            </label>
            <input
              value={form.cover_image}
              onChange={(e) => set('cover_image', e.target.value)}
              placeholder="/covers/book.jpg"
              className="input-dark"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">File path (PDF)</label>
            <input
              value={form.file_path}
              onChange={(e) => set('file_path', e.target.value)}
              placeholder="books/my-book.pdf"
              className="input-dark"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Price (0 if free)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              className="input-dark"
            />
          </div>
          <div className="flex items-end gap-6 pb-1">
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={form.is_free}
                onChange={(e) => set('is_free', e.target.checked)}
              /> Free
            </label>
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => set('is_published', e.target.checked)}
              /> Published
            </label>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button type="submit" disabled={status === 'saving'} className="btn-gold">
            {status === 'saving'
              ? 'Saving…'
              : editingId
              ? 'Update Book'
              : 'Create Book'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-ghost">
              Cancel
            </button>
          )}
        </div>
        {message && (
          <p className="mt-3 text-sm text-success" role="status">
            {message}
          </p>
        )}
      </form>

      {/* List */}
      {loading ? (
        <p className="text-muted">Loading books…</p>
      ) : books.length === 0 ? (
        <p className="text-muted">No books yet. Create your first one above.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-charcoal text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Format</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {books.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-3 font-medium text-ivory">{b.title}</td>
                  <td className="px-4 py-3 text-muted">
                    {(b.file_format || 'PDF').toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {b.is_free ? 'Free' : `$${Number(b.price).toFixed(2)}`}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${
                        b.is_published
                          ? 'bg-success/20 text-success'
                          : 'bg-line/30 text-muted'
                      }`}
                    >
                      {b.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(b)}
                        className="rounded border border-gold/50 px-3 py-1 text-xs text-gold hover:bg-gold/10"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(b.id)}
                        className="rounded border border-danger/50 px-3 py-1 text-xs text-danger hover:bg-danger/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

/* ============ Subscribers ============ */
function Subscribers() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)

  function reload() {
    setLoading(true)
    fetchSubscribers().then((res) => {
      setSubs(res.subscribers || [])
      setLoading(false)
    })
  }

  useEffect(reload, [])

  return (
    <section>
      <h2 className="mb-6 font-display text-2xl text-ivory">
        Subscribers ({subs.length})
      </h2>
      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : subs.length === 0 ? (
        <div className="rounded border border-line bg-panel p-10 text-center text-muted">
          No subscribers yet.
        </div>
      ) : (
        <ul className="divide-y divide-line/60 rounded border border-line">
          {subs.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-medium text-ivory">{s.email}</p>
                <p className="text-xs text-muted">
                  {new Date(s.subscribed_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={async () => {
                  const res = await deleteSubscriber(s.id)
                  if (!res.error) reload()
                }}
                className="rounded border border-danger/50 px-3 py-1 text-xs text-danger hover:bg-danger/10"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/* ============ Users (everyone who engaged) ============ */
function Users() {
  const [subs, setSubs] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchSubscribers(), fetchMessages()]).then(([s, m]) => {
      if (cancelled) return
      setSubs(s.subscribers || [])
      setMessages(m.messages || [])
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Merge subscribers + contact senders into one de-duplicated list.
  const seen = new Set()
  const users = []
  const add = (email, name, kind, when) => {
    const key = (email || '').trim().toLowerCase()
    const existing = seen.has(key)
    seen.add(key)
    users.push({ id: `${kind}-${when}-${key}`, email, name, kind, when, first: !existing })
  }

  const createdAt = (row, field) => new Date(row[field]).getTime()
  ;[...subs.map((s) => ({ kind: 'newsletter', email: s.email, name: '', when: createdAt(s, 'subscribed_at') })),
    ...messages.map((m) => ({ kind: 'contact', email: m.email, name: m.name, when: createdAt(m, 'created_at') }))]
    .sort((a, b) => b.when - a.when)
    .forEach((u) => add(u.email, u.name, u.kind, u.when))

  return (
    <section>
      <h2 className="mb-2 font-display text-2xl text-ivory">Users</h2>
      <p className="mb-6 text-sm text-muted">
        Everyone who has subscribed to the newsletter or sent a message —
        {users.length} unique people.
      </p>

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : users.length === 0 ? (
        <div className="rounded border border-line bg-panel p-10 text-center text-muted">
          No users yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-charcoal text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">First seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-ivory">
                    {u.name || '—'}
                    {u.first && (
                      <span className="ml-2 rounded bg-gold/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-gold">
                        First contact
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${u.email}`} className="text-gold hover:underline">
                      {u.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        u.kind === 'newsletter'
                          ? 'bg-gold/20 text-gold'
                          : 'bg-charcoal text-muted'
                      }`}
                    >
                      {u.kind}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(u.when).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

/* ============ Messages ============ */
function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  function reload() {
    setLoading(true)
    fetchMessages().then((res) => {
      setMessages(res.messages || [])
      setLoading(false)
    })
  }

  useEffect(reload, [])

  async function toggleRead(m) {
    const res = await markMessageRead(m.id, !m.is_read)
    if (!res.error) reload()
  }

  return (
    <section>
      <h2 className="mb-6 font-display text-2xl text-ivory">
        Contact Messages ({messages.length})
      </h2>
      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : messages.length === 0 ? (
        <div className="rounded border border-line bg-panel p-10 text-center text-muted">
          No messages yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`rounded border bg-panel p-5 ${
                m.is_read ? 'border-line' : 'border-gold/60'
              }`}
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ivory">{m.name}</p>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-sm text-gold hover:underline"
                  >
                    {m.email}
                  </a>
                  {m.subject && (
                    <p className="mt-1 text-sm text-muted">{m.subject}</p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-muted">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 leading-relaxed text-muted">{m.message}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => toggleRead(m)}
                  className="rounded border border-gold/50 px-3 py-1 text-xs text-gold hover:bg-gold/10"
                >
                  {m.is_read ? 'Mark unread' : 'Mark read'}
                </button>
                <button
                  onClick={async () => {
                    const res = await deleteMessage(m.id)
                    if (!res.error) reload()
                  }}
                  className="rounded border border-danger/50 px-3 py-1 text-xs text-danger hover:bg-danger/10"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/* ============ Site Content Manager (edit everything) ============ */

function Field({ label, value, onChange, textarea = false, placeholder = '', rows = 3, type = 'text' }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-muted">{label}</label>
      {textarea ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-dark resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-dark"
        />
      )}
    </div>
  )
}

function SectionCard({ title, hint, children }) {
  return (
    <div className="mb-6 rounded border border-line bg-panel p-6">
      <h3 className="mb-1 font-display text-lg text-ivory">{title}</h3>
      {hint && <p className="mb-4 text-xs text-muted">{hint}</p>}
      {!hint && <div className="mb-4" />}
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function ContentManager() {
  const [form, setForm] = useState(null) // normalized content object
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchSiteContent().then(({ data }) => {
      if (cancelled) return
      setForm(buildContent(data || {}))
    })
    return () => {
      cancelled = true
    }
  }, [])

  function update(section, patch) {
    setForm((f) => ({ ...f, [section]: { ...f[section], ...patch } }))
  }

  function updateFeature(i, patch) {
    setForm((f) => {
      const features = (f.offers.features || []).map((feat, idx) =>
        idx === i ? { ...feat, ...patch } : feat
      )
      return { ...f, offers: { ...f.offers, features } }
    })
  }

  function updateSocial(i, patch) {
    setForm((f) => {
      const socials = (f.footer.socials || []).map((s, idx) =>
        idx === i ? { ...s, ...patch } : s
      )
      return { ...f, footer: { ...f.footer, socials } }
    })
  }

  function addSocial() {
    setForm((f) => ({
      ...f,
      footer: { ...f.footer, socials: [...f.footer.socials, { name: '', url: '' }] },
    }))
  }

  function removeSocial(i) {
    setForm((f) => ({
      ...f,
      footer: { ...f.footer, socials: f.footer.socials.filter((_, idx) => idx !== i) },
    }))
  }

  async function saveAll(e) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    setMessage('')

    const payloads = [
      ['site', { name: form.site.name, owner: form.site.owner }],
      ['hero', { eyebrow: form.hero.eyebrow, tagline: form.hero.tagline, quote: form.hero.quote }],
      ['cta', { ...form.cta }],
      [
        'offers',
        {
          title: form.offers.title,
          description: form.offers.description,
          feat0_title: form.offers.features[0]?.title || '',
          feat0_desc: form.offers.features[0]?.description || '',
          feat0_icon: form.offers.features[0]?.icon || 'book',
          feat1_title: form.offers.features[1]?.title || '',
          feat1_desc: form.offers.features[1]?.description || '',
          feat1_icon: form.offers.features[1]?.icon || 'gift',
          feat2_title: form.offers.features[2]?.title || '',
          feat2_desc: form.offers.features[2]?.description || '',
          feat2_icon: form.offers.features[2]?.icon || 'sparkles',
        },
      ],
      ['books', { title: form.books.title, description: form.books.description }],
      ['newsletter', { title: form.newsletter.title, description: form.newsletter.description }],
      ['contact', { title: form.contact.title, description: form.contact.description, email: form.contact.email }],
      ['footer', { socials: form.footer.socials.filter((s) => s.name && s.url) }],
    ]

    for (const [skey, content] of payloads) {
      const res = await saveSiteContent(skey, content)
      if (res.error) {
        setMessage(`Failed saving "${skey}": ${res.error.message}`)
        setSaving(false)
        return
      }
    }

    setMessage('All site content saved. The homepage has been updated.')
    setSaving(false)
    window.dispatchEvent(new Event('jcrown-content-saved'))
  }

  if (!form) {
    return <p className="text-muted">Loading content…</p>
  }

  return (
    <section>
      <h2 className="mb-2 font-display text-2xl text-ivory">Site Content</h2>
      <p className="mb-6 text-sm text-muted">
        Edit every piece of copy on the public site. Changes go live on the homepage
        as soon as you save.
      </p>

      <form onSubmit={saveAll} className="space-y-2">
        {/* Brand */}
        <SectionCard title="Brand & Footer" hint="Shown in the footer and hero wordmark.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Site name"
              value={form.site.name}
              onChange={(v) => update('site', { name: v })}
            />
            <Field
              label="Owner name"
              value={form.site.owner}
              onChange={(v) => update('site', { owner: v })}
            />
          </div>
          <div>
            <p className="mb-2 text-sm text-muted">Social links</p>
            {form.footer.socials.map((s, i) => (
              <div key={i} className="mb-2 flex gap-3">
                <input
                  value={s.name}
                  onChange={(e) => updateSocial(i, { name: e.target.value })}
                  placeholder="Platform (e.g. Instagram)"
                  className="input-dark"
                />
                <input
                  value={s.url}
                  onChange={(e) => updateSocial(i, { url: e.target.value })}
                  placeholder="https://…"
                  className="input-dark"
                />
                <button
                  type="button"
                  onClick={() => removeSocial(i)}
                  className="shrink-0 rounded border border-danger/50 px-3 text-danger hover:bg-danger/10"
                  aria-label="Remove social link"
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" onClick={addSocial} className="btn-ghost !px-4 !py-2 text-xs">
              + Add social link
            </button>
          </div>
        </SectionCard>

        {/* Hero */}
        <SectionCard title="Hero" hint="The first screen visitors see.">
          <Field
            label="Eyebrow"
            value={form.hero.eyebrow}
            onChange={(v) => update('hero', { eyebrow: v })}
          />
          <Field
            label="Quote"
            value={form.hero.quote}
            onChange={(v) => update('hero', { quote: v })}
            textarea
            rows={2}
          />
          <Field
            label="Tagline"
            value={form.hero.tagline}
            onChange={(v) => update('hero', { tagline: v })}
            textarea
          />
        </SectionCard>

        {/* Download CTA */}
        <SectionCard title="Download Call-To-Action" hint="The gold button that links to the books section.">
          <Field
            label="Eyebrow"
            value={form.cta.eyebrow}
            onChange={(v) => update('cta', { eyebrow: v })}
          />
          <Field
            label="Heading"
            value={form.cta.title}
            onChange={(v) => update('cta', { title: v })}
          />
          <Field
            label="Description"
            value={form.cta.description}
            onChange={(v) => update('cta', { description: v })}
            textarea
            rows={2}
          />
          <Field
            label="Button label"
            value={form.cta.button}
            onChange={(v) => update('cta', { button: v })}
          />
        </SectionCard>

        {/* Offers */}
        <SectionCard title="What JCROWN Offers" hint="The three feature cards.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Section title"
              value={form.offers.title}
              onChange={(v) => update('offers', { title: v })}
            />
            <Field
              label="Section description"
              value={form.offers.description}
              onChange={(v) => update('offers', { description: v })}
            />
          </div>
          {['feature 1', 'feature 2', 'feature 3'].map((label, i) => {
            const feat = form.offers.features[i] || { title: '', description: '', icon: 'book' }
            return (
              <div key={i} className="rounded border border-line/60 bg-charcoal/40 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                  {label}
                </p>
                <div className="grid gap-3">
                  <Field
                    label="Title"
                    value={feat.title}
                    onChange={(v) => updateFeature(i, { title: v })}
                  />
                  <Field
                    label="Description"
                    value={feat.description}
                    onChange={(v) => updateFeature(i, { description: v })}
                    textarea
                    rows={2}
                  />
                  <div>
                    <label className="mb-1 block text-sm text-muted">Icon</label>
                    <select
                      value={feat.icon}
                      onChange={(e) => updateFeature(i, { icon: e.target.value })}
                      className="input-dark"
                    >
                      <option value="book">Book</option>
                      <option value="gift">Gift</option>
                      <option value="sparkles">Sparkles</option>
                    </select>
                  </div>
                </div>
              </div>
            )
          })}
        </SectionCard>

        {/* Books section */}
        <SectionCard title="Books Section" hint="Heading copy above the book grid.">
          <Field
            label="Title"
            value={form.books.title}
            onChange={(v) => update('books', { title: v })}
          />
          <Field
            label="Description"
            value={form.books.description}
            onChange={(v) => update('books', { description: v })}
            textarea
            rows={2}
          />
        </SectionCard>

        {/* Newsletter */}
        <SectionCard title="Newsletter" hint="Copy above the email signup form.">
          <Field
            label="Title"
            value={form.newsletter.title}
            onChange={(v) => update('newsletter', { title: v })}
          />
          <Field
            label="Description"
            value={form.newsletter.description}
            onChange={(v) => update('newsletter', { description: v })}
            textarea
            rows={2}
          />
        </SectionCard>

        {/* Contact */}
        <SectionCard title="Contact" hint="Copy and email shown in the contact section.">
          <Field
            label="Title"
            value={form.contact.title}
            onChange={(v) => update('contact', { title: v })}
          />
          <Field
            label="Description"
            value={form.contact.description}
            onChange={(v) => update('contact', { description: v })}
            textarea
            rows={2}
          />
          <Field
            label="Email"
            value={form.contact.email}
            onChange={(v) => update('contact', { email: v })}
            type="email"
          />
        </SectionCard>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button type="submit" disabled={saving} className="btn-gold">
            {saving ? 'Saving…' : 'Save All Site Content'}
          </button>
          {message && (
            <span className="text-sm text-success" role="status">
              {message}
            </span>
          )}
        </div>
      </form>
    </section>
  )
}
