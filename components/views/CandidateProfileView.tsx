import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Candidate } from '../../types'
import { getCandidateById } from '../../services/api/candidateService'

export default function CandidateProfileView() {
  const { id = '' } = useParams()
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getCandidateById(id)
      .then(setCandidate)
      .catch(() => setError('Failed to load candidate'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>
  if (!candidate) return <div className="text-center text-gray-500 p-8">Candidate not found</div>

  return (
    <div className="p-6">
      <div className="glass-card rounded-xl p-6">
        <h1 className="text-2xl font-bold">{candidate.name}</h1>
        <p className="text-theme-text-muted mt-2">{candidate.party} • {candidate.governorate}</p>
        <p className="mt-4">{candidate.bio || 'No biography available.'}</p>
      </div>
    </div>
  )
}
