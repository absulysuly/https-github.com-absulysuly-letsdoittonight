import { useEffect, useState } from 'react'
import PostCard from '../PostCard'
import type { Governorate, Post } from '../../types'
import { getPosts } from '../../services/api/postService'

export default function HomeView() {
  const [selectedGovernorate, setSelectedGovernorate] = useState<Governorate | 'All'>('All')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getPosts(selectedGovernorate)
      .then(setPosts)
      .catch(() => setError('Failed to load posts'))
      .finally(() => setLoading(false))
  }, [selectedGovernorate])

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>
  if (!posts.length) return <div className="text-center text-gray-500 p-8">No posts yet</div>

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="max-w-xs">
        <label htmlFor="gov" className="text-sm text-theme-text-muted">Governorate</label>
        <input id="gov" value={selectedGovernorate} onChange={(e) => setSelectedGovernorate((e.target.value || 'All') as Governorate | 'All')} className="w-full mt-1 p-2 rounded bg-white/10 border border-white/20" />
      </div>
      {posts.map((post) => <PostCard key={post.id} post={post} user={null} requestLogin={() => undefined} language="en" onSelectProfile={() => undefined} onSelectPost={() => undefined} />)}
    </div>
  )
}
