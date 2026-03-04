import type { Language } from '../../types'
import SimplePostCard, { SimplePostCardSkeleton } from '../SimplePostCard'
import CreatePostBox from '../CreatePostBox'
import { postService } from '../../services/postService'
import { useFeed } from '../../utils/useFeed'

export default function GeneralFeedView({ language }: { language: Language }) {
  const { posts, loading, loadingMore, error, hasMore, setPosts, retry, loadMore } = useFeed({
    fetchPage: postService.getGeneralPosts,
  })

  return (
    <div className="space-y-4 p-4">
      <CreatePostBox language={language} category="general" onCreated={(post) => setPosts((prev) => [post, ...prev])} />
      {error ? (
        <div className="rounded border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
          <p>{error}</p>
          <button className="mt-2 rounded bg-red-900/30 px-3 py-1" onClick={retry}>Retry</button>
        </div>
      ) : null}

      {loading ? (
        <>
          <SimplePostCardSkeleton />
          <SimplePostCardSkeleton />
        </>
      ) : (
        posts.map((post) => <SimplePostCard key={post.id} post={post} language={language} />)
      )}

      {!loading && !error && posts.length === 0 ? <p className="text-sm text-theme-text-muted">No posts yet.</p> : null}

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
