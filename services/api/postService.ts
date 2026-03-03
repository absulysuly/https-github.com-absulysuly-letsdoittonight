import { supabase } from '../supabaseClient'
import { MOCK_POSTS } from '../../constants'
import type { Governorate, Post } from '../../types'

export const getPosts = async (governorate?: Governorate | 'All'): Promise<Post[]> => {
  if (!supabase) {
    return MOCK_POSTS.filter((p) => !governorate || governorate === 'All' || p.author.governorate === governorate)
  }
  let query = supabase.from('posts').select('*, users(name, avatar_url)').order('created_at', { ascending: false })
  if (governorate && governorate !== 'All') query = query.eq('governorate', governorate)
  const { data, error } = await query
  if (error) throw error
  return data as unknown as Post[]
}

export const createPost = async (post: Partial<Post>): Promise<Post> => {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('posts').insert(post).select().single()
  if (error) throw error
  return data as unknown as Post
}
