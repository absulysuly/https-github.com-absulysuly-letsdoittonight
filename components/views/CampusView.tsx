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
  const { isStudent } = useAuth()

  useEffect(() => {
    let isMounted = true

    const fetchPosts = async () => {
      try {
        const data = await postService.getCampusPosts()
        if (isMounted) {
          setPosts(data)
        }
      } catch (error) {
        console.error('Failed to load campus feed', error)
      }
    }

    void fetchPosts()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">{text.campus}</h2>
      {isStudent ? (
        <CreatePostBox language={language} category="campus" onCreated={(post) => setPosts((prev) => [post, ...prev])} />
      ) : (
        <p className="text-sm text-theme-text-muted">{text.studentsOnly}</p>
      )}
      {posts.map((post) => (
        <SimplePostCard key={post.id} post={post} language={language} />
      ))}
    </div>
  )
}
