import { useEffect, useState } from 'react'
import api from '../api/axios'
import StoryCard from '../components/StoryCard'

interface Story {
  _id: string
  title: string
  url: string
  points: number
  author: string
  postedAt: string
}

interface Pagination {
  total: number
  page: number
  pages: number
  limit: number
}

const Home = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [scraping, setScraping] = useState(false)
  const [error, setError] = useState('')

  const fetchStories = async (p: number) => {
    try {
      setLoading(true)
      const { data } = await api.get(`/stories?page=${p}&limit=10`)
      setStories(data.stories)
      setPagination(data.pagination)
    } catch {
      setError('Failed to load stories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStories(page)
  }, [page])

  const handleScrape = async () => {
    try {
      setScraping(true)
      setError('')
      await api.post('/scrape')
      await fetchStories(1)
      setPage(1)
    } catch {
      setError('Scrape failed. Try again.')
    } finally {
      setScraping(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Top Stories</h1>
        <button
          onClick={handleScrape}
          disabled={scraping}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded transition"
        >
          {scraping ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Scraping...
            </>
          ) : (
            '↻ Refresh Stories'
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20 text-gray-400">Loading stories...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {stories.map((story, i) => (
              <StoryCard key={story._id} story={story} rank={(page - 1) * 10 + i + 1} />
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6 text-sm">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Prev
              </button>
              <span className="text-gray-500">
                Page <span className="font-semibold text-gray-800">{pagination.page}</span> of {pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === pagination.pages}
                className="px-4 py-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Home
