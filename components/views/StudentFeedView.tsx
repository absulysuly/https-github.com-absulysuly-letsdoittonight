import type { Language } from '../../types'
import SimplePostCard, { SimplePostCardSkeleton } from '../SimplePostCard'
import { UI_TEXT } from '../../translations'
import CreatePostBox from '../CreatePostBox'
import { useAuth } from '../../context/AuthContext'
import { postService } from '../../services/postService'
import { useFeed } from '../../utils/useFeed'

export default function StudentFeedView({ language }: { language: Language }) {
  const text = UI_TEXT[language]
  const { isStudent } = useAuth()
  const { posts, loading, error, retry, setPosts } = useFeed({ fetchPage: postService.getStudentPosts })

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">{text.students}</h2>
      {!isStudent ? <p className="rounded border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">{text.studentsOnly}</p> : null}
      {error ? (
        <div className="rounded border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
          <p>{error}</p>
          <button className="mt-2 rounded bg-red-900/30 px-3 py-1" onClick={retry}>Retry</button>
        </div>
      ) : null}
      {isStudent ? <CreatePostBox language={language} category="student" onCreated={(post) => setPosts((prev) => [post, ...prev])} /> : null}

      {loading ? (
        <>
          <SimplePostCardSkeleton />
          <SimplePostCardSkeleton />
        </>
      ) : (
        posts.map((post) => <SimplePostCard key={post.id} post={post} language={language} />)
      )}
      {!loading && !error && posts.length === 0 ? <p className="text-sm text-theme-text-muted">No student posts yet.</p> : null}
    </div>
  )
}
