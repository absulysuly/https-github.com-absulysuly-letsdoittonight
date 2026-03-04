import { useEffect, useState } from 'react'
import { postService } from '../../services/postService'
import type { Language, Post } from '../../types'
import SimplePostCard from '../SimplePostCard'
import { UI_TEXT } from '../../translations'
import CreatePostBox from '../CreatePostBox'
import { useAuth } from '../../context/AuthContext'

export default function CampusView({ language }: { language: Language }) {
  const text = UI_TEXT[language]
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isStudent } = useAuth()

  useEffect(() => {
    let isMounted = true

    const fetchPosts = async () => {
      try {
        setError(null)
        const data = await postService.getCampusPosts()
        if (isMounted) {
          setPosts(data)
        }
      } catch (error) {
        console.error('Failed to load campus feed', error)
        if (isMounted) {
          setError('Unable to load the campus feed right now. Please try again.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void fetchPosts()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">{text.campus}</h2>
      {error ? <p className="rounded border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
      {isStudent ? (
        <CreatePostBox language={language} category="campus" onCreated={(post) => setPosts((prev) => [post, ...prev])} />
      ) : (
        <p className="text-sm text-theme-text-muted">{text.studentsOnly}</p>
      )}
      {posts.map((post) => (
        <SimplePostCard key={post.id} post={post} language={language} />
      ))}
      {posts.length === 0 ? <p className="text-sm text-theme-text-muted">No campus posts yet.</p> : null}
    </div>
  )
}
