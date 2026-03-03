import { supabase } from './supabaseClient'
import type { Profile, UserRole } from '../types'

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    if (!supabase) return { id: userId, role: 'general' }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, role')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Failed to load profile', error)
      return null
    }

    return {
      ...data,
      role: ((data.role as UserRole) || 'general'),
    }
  },
}
