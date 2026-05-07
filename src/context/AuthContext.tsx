import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import api from '../api/axios'

interface User {
  id: string
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  bookmarks: string[]
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  toggleBookmark: (storyId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [bookmarks, setBookmarks] = useState<string[]>([])

  useEffect(() => {
    if (user) fetchBookmarks()
  }, [user])

  const fetchBookmarks = async () => {
    try {
      const { data } = await api.get('/stories/bookmarks')
      setBookmarks(data.map((s: { _id: string }) => s._id))
    } catch {
      setBookmarks([])
    }
  }

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    setUser(data.user)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const register = async (username: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { username, email, password })
    setUser(data.user)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
    setBookmarks([])
    localStorage.removeItem('user')
  }

  const toggleBookmark = async (storyId: string) => {
    const { data } = await api.post(`/stories/${storyId}/bookmark`)
    setBookmarks(data.bookmarks)
  }

  return (
    <AuthContext.Provider value={{ user, bookmarks, login, register, logout, toggleBookmark }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
