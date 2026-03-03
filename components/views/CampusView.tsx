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
    postService.getCampusPosts().then(setPosts)
  }, [])

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">{text.campus}</h2>
      {isStudent && <CreatePostBox language={language} category="campus" onCreated={(post) => setPosts((prev) => [post, ...prev])} />}
      {posts.map((post) => (
        <SimplePostCard key={post.id} post={post} language={language} />
      ))}
    </div>
  )
}
