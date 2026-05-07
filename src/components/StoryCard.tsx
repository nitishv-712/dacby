import { useAuth } from '../context/AuthContext'

interface Story {
  _id: string
  title: string
  url: string
  points: number
  author: string
  postedAt: string
}

interface Props {
  story: Story
  rank?: number
}

const StoryCard = ({ story, rank }: Props) => {
  const { user, bookmarks, toggleBookmark } = useAuth()
  const isBookmarked = bookmarks.includes(story._id)

  const displayUrl = (() => {
    try {
      return new URL(story.url).hostname.replace('www.', '')
    } catch {
      return 'news.ycombinator.com'
    }
  })()

  return (
    <div className="flex gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition">
      <span className="text-gray-400 font-mono text-sm w-6 shrink-0 pt-0.5 text-right">
        {rank}.
      </span>
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-2">
          <a
            href={story.url || `https://news.ycombinator.com`}
            target="_blank"
            rel="noreferrer"
            className="text-gray-900 font-medium hover:text-orange-600 transition leading-snug"
          >
            {story.title}
          </a>
          <span className="text-xs text-gray-400 shrink-0">({displayUrl})</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="text-orange-500 font-semibold">▲ {story.points}</span>
          <span>
            by <span className="font-medium text-gray-700">{story.author || 'unknown'}</span>
          </span>
          <span>{story.postedAt}</span>
          {user && (
            <button
              onClick={() => toggleBookmark(story._id)}
              className={`ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border transition ${
                isBookmarked
                  ? 'bg-orange-50 border-orange-300 text-orange-600'
                  : 'border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500'
              }`}
            >
              🔖 {isBookmarked ? 'Saved' : 'Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default StoryCard
