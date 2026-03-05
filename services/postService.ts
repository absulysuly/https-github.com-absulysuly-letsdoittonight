import { supabase } from './supabaseClient'
import type { Post, UserRole } from '../types'

const POST_SELECT = 'id, content, user_id, created_at, category, likes_count, comments_count, shares_count, profile:profiles(full_name, avatar_url)'

const fetchPosts = async (category: 'general' | 'campus', limit = 20, offset = 0): Promise<Post[]> => {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('category', category)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.warn('[hamlet:postService] Failed to load posts', error)
    return []
  }

  return (data as Post[]) ?? []
}

export const postService = {
  getGeneralPosts(limit = 20, offset = 0): Promise<Post[]> {
    return fetchPosts('general', limit, offset)
  },
  getCampusPosts(limit = 20, offset = 0): Promise<Post[]> {
    return fetchPosts('campus', limit, offset)
  },
  async createPost(payload: Pick<Post, 'content' | 'category' | 'user_id'>, role: UserRole): Promise<Post> {
    if (payload.category === 'campus' && role !== 'student' && role !== 'admin') {
      throw new Error('Unauthorized: campus posts require student role')
    }

    if (!supabase) {
      throw new Error('Supabase is not configured. Cannot create post.')
    }

    const { data, error } = await supabase
      .from('posts')
      .insert(payload)
      .select('id, content, user_id, created_at, category, likes_count, comments_count, shares_count')
      .single()

    if (error) {
      throw new Error(error.message || 'Failed to create post.')
    }

    return data as Post
  },
}
