import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.warn('[hamlet] Supabase environment variables missing. Running in offline mode.')
}

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null

export const isSupabaseConfigured = (): boolean => Boolean(supabase)
