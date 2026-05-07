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

const Bookmarks = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/stories/bookmarks')
        setStories(data)
      } catch {
        setError('Failed to load bookmarks')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Bookmarks</h1>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20 text-gray-400">Loading bookmarks...</div>
      ) : stories.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No bookmarks yet.</p>
          <p className="text-sm mt-1">Start saving stories from the home page!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {stories.map((story, i) => (
            <StoryCard key={story._id} story={story} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Bookmarks
