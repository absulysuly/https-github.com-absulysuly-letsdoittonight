import { useEffect, useState } from 'react'
import type { Candidate, Governorate } from '../../types'
import { getCandidates } from '../../services/api/candidateService'

export default function CandidatesView() {
  const [selectedGovernorate, setSelectedGovernorate] = useState<Governorate | 'All'>('All')
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getCandidates(selectedGovernorate)
      .then(setCandidates)
      .catch(() => setError('Failed to load candidates'))
      .finally(() => setLoading(false))
  }, [selectedGovernorate])

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>
  if (!candidates.length) return <div className="text-center text-gray-500 p-8">No candidates found</div>

  return (
    <div className="p-4 sm:p-6">
      <input value={selectedGovernorate} onChange={(e) => setSelectedGovernorate((e.target.value || 'All') as Governorate | 'All')} className="p-2 rounded bg-white/10 border border-white/20 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="glass-card rounded-lg p-4">
            <p className="font-semibold">{candidate.name}</p>
            <p className="text-sm text-theme-text-muted">{candidate.party} • {candidate.governorate}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
