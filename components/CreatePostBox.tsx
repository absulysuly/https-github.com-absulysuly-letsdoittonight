import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { postService } from '../services/postService'
import { UI_TEXT } from '../translations'
import type { Language, Post } from '../types'

export default function CreatePostBox({ language, category, onCreated }: { language: Language; category: 'general' | 'campus'; onCreated: (post: Post) => void }) {
  const text = UI_TEXT[language]
  const { profile, isAuthenticated, isStudent } = useAuth()
  const [content, setContent] = useState('')

  const submit = async () => {
    if (!profile || !content.trim()) {
      return
    }

    if (category === 'campus' && !isStudent) {
      return
    }

    const post = await postService.createPost({ content, category, user_id: profile.id })
    if (!post) {
      return
    }

    setContent('')
    onCreated(post)
  }

  if (!isAuthenticated) {
    return <p className="text-sm text-theme-text-muted">{text.loginToPost}</p>
  }

  return (
    <div className="rounded-xl border border-white/10 p-3 space-y-2">
      <textarea className="w-full rounded bg-transparent border border-white/10 p-2" placeholder={text.whatsOnYourMind} value={content} onChange={(e) => setContent(e.target.value)} />
      <button className="rounded bg-primary px-3 py-2" onClick={submit}>{text.createPost}</button>
    </div>
  )
}
