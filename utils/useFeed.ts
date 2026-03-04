import { useCallback, useEffect, useRef, useState } from 'react'
import type { Post } from '../types'

const PAGE_SIZE = 20

interface UseFeedOptions {
  fetchPage: (limit: number, offset: number) => Promise<Post[]>
}

export function useFeed({ fetchPage }: UseFeedOptions) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const isFetchingRef = useRef(false)

  const loadInitial = useCallback(async () => {
    if (isFetchingRef.current) return

    isFetchingRef.current = true
    setLoading(true)
    try {
      setError(null)
      const data = await fetchPage(PAGE_SIZE, 0)
      setPosts(data)
      setOffset(0)
      setHasMore(data.length === PAGE_SIZE)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load feed.')
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }, [fetchPage])

  const loadMore = useCallback(async () => {
    if (!hasMore || isFetchingRef.current) return

    isFetchingRef.current = true
    setLoadingMore(true)
    const nextOffset = offset + PAGE_SIZE

    try {
      setError(null)
      const newPosts = await fetchPage(PAGE_SIZE, nextOffset)
      setOffset(nextOffset)
      setHasMore(newPosts.length === PAGE_SIZE)
      setPosts((prev) => {
        const ids = new Set(prev.map((post) => post.id))
        return [...prev, ...newPosts.filter((post) => !ids.has(post.id))]
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load more posts.')
    } finally {
      setLoadingMore(false)
      isFetchingRef.current = false
    }
  }, [fetchPage, hasMore, offset])

  useEffect(() => {
    void loadInitial()
  }, [loadInitial])

  return { posts, loading, loadingMore, error, hasMore, setPosts, retry: loadInitial, loadMore }
}
