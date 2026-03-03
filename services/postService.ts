import { supabase } from './supabaseClient'
import type { Post } from '../types'

const fallbackPosts: Post[] = [
  {
    id: 'mock-general-1',
    content: 'Welcome to the community feed! 🎉',
    user_id: 'mock',
    created_at: new Date().toISOString(),
    category: 'general',
    likes_count: 2,
    comments_count: 1,
    shares_count: 0,
    profile: { full_name: 'Community Team' },
  },
]

const getFallbackPosts = (category?: 'general' | 'campus'): Post[] => fallbackPosts.filter((p) => !category || p.category === category)

const runQuery = async (category?: 'general' | 'campus', limit = 20, offset = 0): Promise<Post[]> => {
  try {
    if (!supabase) {
      return getFallbackPosts(category)
    }

    let query = supabase
      .from('posts')
      .select('id, content, user_id, created_at, category, likes_count, comments_count, shares_count, profile:profiles(full_name, avatar_url)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) {
      throw error
    }

    return (data as Post[]) ?? []
  } catch (error) {
    console.error('Failed to fetch posts', error)
    return getFallbackPosts(category)
  }
}

export const postService = {
  getGeneralPosts(limit = 20, offset = 0): Promise<Post[]> {
    return runQuery('general', limit, offset)
  },
  getCampusPosts(limit = 20, offset = 0): Promise<Post[]> {
    return runQuery('campus', limit, offset)
  },
  async createPost(payload: Pick<Post, 'content' | 'category' | 'user_id'>): Promise<Post | null> {
    try {
      if (!supabase) {
        return {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          ...payload,
        }
      }

      const { data, error } = await supabase
        .from('posts')
        .insert(payload)
        .select('id, content, user_id, created_at, category, likes_count, comments_count, shares_count')
        .single()

      if (error) {
        throw error
      }

      return data as Post
    } catch (error) {
      console.error('Failed to create post', error)
      return null
    }
  },
}
