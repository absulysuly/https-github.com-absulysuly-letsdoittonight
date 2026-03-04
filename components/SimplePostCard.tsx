import { UI_TEXT } from '../translations'
import type { Language, Post } from '../types'

export default function SimplePostCard({ post, language }: { post: Post; language: Language }) {
  const text = UI_TEXT[language]

  return (
    <article className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs text-theme-text-muted">{new Date(post.created_at).toLocaleString()}</div>
      <p>{post.content}</p>
      <div className="flex gap-4 text-sm text-theme-text-muted">
        <button type="button">{text.like}</button>
        <button type="button">{text.comment}</button>
        <button type="button">{text.share}</button>
      </div>
    </article>
  )
}
