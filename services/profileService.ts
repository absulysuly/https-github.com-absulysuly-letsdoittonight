import { supabase } from './supabaseClient'
import type { Profile, UserRole } from '../types'

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      if (!supabase) {
        return { id: userId, role: 'general' }
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, email, full_name, avatar_url, role')
        .eq('id', userId)
        .single()

      if (error) {
        throw error
      }

      return {
        ...data,
        role: ((data.role as UserRole) || 'general'),
      }
    } catch (error) {
      console.error('Failed to load profile', error)
      return null
    }
  },
}
