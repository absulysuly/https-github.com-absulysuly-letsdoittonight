import { supabase } from '../supabaseClient'
import { MOCK_USERS } from '../../constants'
import { UserRole, type Governorate, type User } from '../../types'

export type Candidate = User

export const getCandidates = async (governorate?: Governorate | 'All'): Promise<Candidate[]> => {
  if (!supabase) {
    return MOCK_USERS.filter((c) => c.role === UserRole.Candidate && (!governorate || governorate === 'All' || c.governorate === governorate))
  }
  let query = supabase.from('candidates').select('*')
  if (governorate && governorate !== 'All') query = query.eq('governorate', governorate)
  const { data, error } = await query
  if (error) throw error
  return data as unknown as Candidate[]
}

export const getCandidateById = async (id: string): Promise<Candidate | null> => {
  if (!supabase) return MOCK_USERS.find((c) => c.id === id && c.role === UserRole.Candidate) ?? null
  const { data, error } = await supabase.from('candidates').select('*').eq('id', id).single()
  if (error) return null
  return data as unknown as Candidate
}
