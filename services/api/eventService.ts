import { supabase } from '../supabaseClient'
import { MOCK_EVENTS } from '../../constants'
import type { Event } from '../../types'

export const getEvents = async (): Promise<Event[]> => {
  if (!supabase) return MOCK_EVENTS
  const { data, error } = await supabase.from('events').select('*, users(name, avatar_url)').order('date', { ascending: true })
  if (error) throw error
  return data as unknown as Event[]
}
