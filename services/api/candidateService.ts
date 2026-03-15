import { supabase } from '../supabaseClient'
import { MOCK_USERS } from '../../constants'
import { UserRole, type Governorate, type User } from '../../types'

export type Candidate = User

type DirectoryRow = Record<string, unknown>

const DIRECTORY_TABLE = 'directory'

const toStringOrEmpty = (value: unknown): string => (typeof value === 'string' ? value : '')

const mapDirectoryRowToCandidate = (row: DirectoryRow): Candidate => {
  const governorate = toStringOrEmpty(row.governorate || row.governorate_name) as Governorate
  const party = toStringOrEmpty(row.party || row.party_name) || 'Independent'

  return {
    id: toStringOrEmpty(row.id || row.user_id || row.candidate_id),
    name: toStringOrEmpty(row.name || row.full_name || row.candidate_name || row.display_name) || 'Unknown Candidate',
    role: UserRole.Candidate,
    avatarUrl: toStringOrEmpty(row.avatar_url || row.photo_url),
    verified: Boolean(row.verified ?? true),
    party,
    governorate,
    partySlug: toStringOrEmpty(row.party_slug),
    governorateSlug: toStringOrEmpty(row.governorate_slug),
    bio: toStringOrEmpty(row.bio),
    gender: (toStringOrEmpty(row.gender) as Candidate['gender']) || undefined,
    stories: [],
  }
}

const getMockCandidates = (governorate?: Governorate | 'All'): Candidate[] =>
  MOCK_USERS.filter((c) => c.role === UserRole.Candidate && (!governorate || governorate === 'All' || c.governorate === governorate))

export const getCandidates = async (governorate?: Governorate | 'All'): Promise<Candidate[]> => {
  if (!supabase) {
    return getMockCandidates(governorate)
  }

  let query = supabase.from(DIRECTORY_TABLE).select('*')
  if (governorate && governorate !== 'All') query = query.eq('governorate', governorate)

  const { data, error } = await query
  if (error) throw error

  return ((data || []) as DirectoryRow[]).map(mapDirectoryRowToCandidate)
}

export const getCandidateById = async (id: string): Promise<Candidate | null> => {
  if (!supabase) return getMockCandidates().find((c) => c.id === id) ?? null

  const { data, error } = await supabase.from(DIRECTORY_TABLE).select('*').eq('id', id).single()
  if (error || !data) return null

  return mapDirectoryRowToCandidate(data as DirectoryRow)
}
