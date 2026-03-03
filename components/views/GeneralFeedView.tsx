import { useEffect, useState } from 'react'
import { postService } from '../../services/postService'
import type { Post, Language } from '../../types'
import SimplePostCard from '../SimplePostCard'
import CreatePostBox from '../CreatePostBox'

export default function GeneralFeedView({ language }: { language: Language }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    postService.getGeneralPosts(20, 0).then((data) => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  const loadMore = async () => {
    const nextOffset = offset + 20
    const more = await postService.getGeneralPosts(20, nextOffset)
    setOffset(nextOffset)
    setPosts((prev) => [...prev, ...more])
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="space-y-4 p-4">
      <CreatePostBox language={language} category="general" onCreated={(post) => setPosts((prev) => [post, ...prev])} />
      {posts.map((post) => (
        <SimplePostCard key={post.id} post={post} language={language} />
      ))}
      <button className="rounded bg-primary px-4 py-2" onClick={loadMore}>Load more</button>
    </div>
  )
}
