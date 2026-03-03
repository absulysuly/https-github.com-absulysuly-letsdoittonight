export type Language = 'en' | 'ar' | 'ku'

export type UserRole = 'general' | 'student'

export interface Profile {
  id: string
  role: UserRole
  username?: string
  email?: string
  full_name?: string
  avatar_url?: string
}

export interface Post {
  id: string
  content: string
  user_id: string
  created_at: string
  category: 'general' | 'campus'
  likes_count?: number
  comments_count?: number
  shares_count?: number
  profile?: {
    full_name?: string
    avatar_url?: string
  }
}
