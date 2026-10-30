import { supabase, isSupabaseConfigured } from './supabase.js'
import { BOOKS_BUCKET } from './books.js'

/**
 * Admin data layer.
 *
 * The admin portal needs write access to books/site_content and read access
 * to subscribers/contacts — all of which RLS restricts to `service_role`.
 * In production you should talk to Supabase from a server with the
 * service_role key. For this single-client setup we authenticate the admin
 * with a password (from VITE_ADMIN_PASSWORD) so the dashboard only renders
 * for the owner, then issue writes through the anon client. This is a
 * pragmatic local-admin gate, NOT a substitute for server-side auth.
 */

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'jcrown-admin'

export function loginAdmin(password) {
  const ok = password === ADMIN_PASSWORD
  if (ok) sessionStorage.setItem('jcrown_admin', '1')
  return ok
}

export function logoutAdmin() {
  sessionStorage.removeItem('jcrown_admin')
}

export function isAdminAuthed() {
  return sessionStorage.getItem('jcrown_admin') === '1'
}

// ---- site_content (About / bio editor) ---------------------

export async function fetchSiteContent() {
  if (!supabase) return { data: null, error: null }
  const { data, error } = await supabase.from('site_content').select('*')
  if (error) return { data: null, error }
  const map = {}
  for (const row of data || []) map[row.skey] = row.content
  return { data: map, error: null }
}

export async function saveSiteContent(skey, content) {
  if (!supabase) return { error: { message: 'Supabase is not configured.' } }
  const { error } = await supabase
    .from('site_content')
    .upsert({ skey, content }, { onConflict: 'skey' })
  return { error }
}

// ---- Books CRUD ----------------------------------------------

export async function fetchAllBooks() {
  if (!supabase) return { books: [], error: null }
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })
  return { books: data || [], error }
}

export async function createBook(payload) {
  if (!supabase) return { error: { message: 'Supabase is not configured.' } }
  const { error } = await supabase.from('books').insert(payload)
  return { error }
}

export async function updateBook(id, payload) {
  if (!supabase) return { error: { message: 'Supabase is not configured.' } }
  const { error } = await supabase.from('books').update(payload).eq('id', id)
  return { error }
}

export async function deleteBook(id) {
  if (!supabase) return { error: { message: 'Supabase is not configured.' } }
  const { error } = await supabase.from('books').delete().eq('id', id)
  return { error }
}

// ---- Subscribers & Messages ----------------------------------

export async function fetchSubscribers() {
  if (!supabase) return { subscribers: [], error: null }
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false })
  return { subscribers: data || [], error }
}

export async function deleteSubscriber(id) {
  if (!supabase) return { error }
  const { error } = await supabase.from('subscribers').delete().eq('id', id)
  return { error }
}

export async function fetchMessages() {
  if (!supabase) return { messages: [], error: null }
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })
  return { messages: data || [], error }
}

export async function markMessageRead(id, isRead) {
  if (!supabase) return { error }
  const { error } = await supabase.from('contacts').update({ is_read: isRead }).eq('id', id)
  return { error }
}

export async function deleteMessage(id) {
  if (!supabase) return { error }
  const { error } = await supabase.from('contacts').delete().eq('id', id)
  return { error }
}

export { isSupabaseConfigured }
