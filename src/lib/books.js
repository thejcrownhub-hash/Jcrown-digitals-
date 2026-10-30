import { supabase, isSupabaseConfigured } from './supabase.js'

export const BOOKS_BUCKET = 'book-files'

function isRemoteUrl(path) {
  return typeof path === 'string' && /^https?:\/\//i.test(path)
}

function toPublicUrl(path) {
  if (!path) return null
  if (isRemoteUrl(path)) return path
  if (!supabase) return null
  const { data } = supabase.storage.from(BOOKS_BUCKET).getPublicUrl(path)
  return data?.publicUrl ?? null
}

async function toSignedUrl(path, expiresIn = 3600) {
  if (!path) return null
  if (isRemoteUrl(path)) return path
  if (!supabase) return null
  const { data, error } = await supabase
    .storage
    .from(BOOKS_BUCKET)
    .createSignedUrl(path, expiresIn, { download: true })
  if (error) return null
  return data?.signedUrl ?? null
}

export async function fetchBooks() {
  if (!supabase) return { books: [], error: null }

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) return { books: [], error }

  const books = await Promise.all(
    (data || []).map(async (row) => {
      const isFree = Boolean(row.is_free)
      return {
        id: row.id,
        title: row.title || 'Untitled publication',
        description: row.description || '',
        format: (row.file_format || row.format || 'PDF').toUpperCase(),
        price: Number(row.price) || 0,
        isFree,
        coverUrl: toPublicUrl(row.cover_image || row.cover_url),
        downloadUrl: isFree ? await toSignedUrl(row.file_path) : null,
        downloadCount: row.download_count ?? 0,
        createdAt: row.created_at,
      }
    })
  )

  return { books, error: null }
}

export async function subscribeEmail(email) {
  if (!supabase) {
    return { error: { message: 'Newsletter signup is currently disabled.' } }
  }

  const { data, error } = await supabase.from('subscribers').insert({ email }).select()

  if (error) {
    if (error.code === '23505' || /duplicate/i.test(error.message || '')) {
      return { data, error: { message: "You're already on the list — thanks!" } }
    }
    return { data, error }
  }

  return { data, error }
}

export async function submitContact(payload) {
  if (!supabase) {
    return { error: { message: 'The contact form is currently disabled.' } }
  }

  const { error } = await supabase.from('contacts').insert({
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
  })

  return { error }
}

export { isSupabaseConfigured }
