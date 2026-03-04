import { useEffect, useState } from 'react'
import { postService } from '../../services/postService'
import type { Post, Language } from '../../types'
import SimplePostCard from '../SimplePostCard'
import CreatePostBox from '../CreatePostBox'
import { getErrorMessage } from '../../utils/error'

const PAGE_SIZE = 20

export default function GeneralFeedView({ language }: { language: Language }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchPosts = async () => {
      try {
        setError(null)
        const data = await postService.getGeneralPosts(PAGE_SIZE, 0)
        if (isMounted) {
          setPosts(data)
          setOffset(0)
          setHasMore(data.length === PAGE_SIZE)
        }
      } catch (error) {
        console.error('Failed to load general feed', error)
        if (isMounted) {
          setError(getErrorMessage(error, 'Unable to load the feed right now. Please try again.'))
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

  const loadMore = async () => {
    if (!hasMore || loadingMore) {
      return
    }

    setLoadingMore(true)
    const nextOffset = offset + PAGE_SIZE
    try {
      setError(null)
      const more = await postService.getGeneralPosts(PAGE_SIZE, nextOffset)
      setOffset(nextOffset)
      setHasMore(more.length === PAGE_SIZE)
      setPosts((prev) => {
        const seen = new Set(prev.map((post) => post.id))
        const unique = more.filter((post) => !seen.has(post.id))
        return [...prev, ...unique]
      })
    } catch (error) {
      console.error('Failed to load more posts', error)
      setError(getErrorMessage(error, 'Unable to load additional posts right now.'))
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="space-y-4 p-4">
      <CreatePostBox language={language} category="general" onCreated={(post) => setPosts((prev) => [post, ...prev])} />
      {error ? <p className="rounded border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
      {posts.map((post) => (
        <SimplePostCard key={post.id} post={post} language={language} />
      ))}
      {posts.length === 0 ? <p className="text-sm text-theme-text-muted">No posts yet.</p> : null}
      <button
        className="rounded bg-primary px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={loadMore}
        disabled={loadingMore || !hasMore}
      >
        {loadingMore ? 'Loading...' : hasMore ? 'Load more' : 'No more posts'}
      </button>
    </div>
  )
}
