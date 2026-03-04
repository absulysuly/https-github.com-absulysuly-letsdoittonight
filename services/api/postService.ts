import { supabase } from '../supabaseClient'
import { MOCK_POSTS } from '../../constants'
import type { Region, Post } from '../../types'

export const getPosts = async (region?: Region | 'All'): Promise<Post[]> => {
  if (!supabase) {
    return MOCK_POSTS.filter((p) => !region || region === 'All' || p.author.region === region)
  }
  let query = supabase.from('posts').select('*, users(name, avatar_url)').order('created_at', { ascending: false })
  if (region && region !== 'All') query = query.eq('region', region)
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
