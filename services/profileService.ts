import { supabase } from './supabaseClient'
import type { Profile, UserRole } from '../types'

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, email, full_name, avatar_url, role')
      .eq('id', userId)
      .single()

    if (error) {
      throw new Error(error.message || 'Failed to load profile.')
    }

    return {
      ...data,
      role: ((data.role as UserRole) || 'general'),
    }
  },
}
