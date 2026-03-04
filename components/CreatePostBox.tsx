import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { postService } from '../services/postService'
import { UI_TEXT } from '../translations'
import { sanitizePostContent } from '../utils/sanitize'
import { getErrorMessage } from '../utils/error'
import type { Language, Post } from '../types'

export default function CreatePostBox({ language, category, onCreated }: { language: Language; category: 'general' | 'campus'; onCreated: (post: Post) => void }) {
  const text = UI_TEXT[language]
  const { profile, isAuthenticated, role } = useAuth()
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    const sanitizedContent = sanitizePostContent(content)
    if (!profile || !sanitizedContent || submitting) return

    try {
      setSubmitting(true)
      setError(null)
      const post = await postService.createPost({ content: sanitizedContent, category, user_id: profile.id }, role)
      setContent('')
      onCreated(post)
    } catch (err) {
      setError(getErrorMessage(err, 'Post failed. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return <p className="text-sm text-theme-text-muted">{text.loginToPost}</p>
  }

  return (
    <div className="space-y-2 rounded-xl border border-white/10 p-3">
      {error ? <p className="rounded border border-red-400/30 bg-red-500/10 p-2 text-sm text-red-200">{error}</p> : null}
      <textarea
        className="w-full rounded border border-white/10 bg-transparent p-2"
        placeholder={text.whatsOnYourMind}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={1000}
        aria-label={text.whatsOnYourMind}
      />
      <button
        className="rounded bg-primary px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={submit}
        disabled={submitting || !sanitizePostContent(content)}
      >
        {submitting ? 'Publishing...' : text.createPost}
      </button>
    </div>
  )
}
