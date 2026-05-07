import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-orange-500 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <Link to="/" className="text-xl font-bold tracking-tight hover:opacity-90">
        HN Stories
      </Link>
      <div className="flex items-center gap-4 text-sm font-medium">
        {user ? (
          <>
            <span className="text-orange-100">Hi, {user.username}</span>
            <Link to="/bookmarks" className="hover:underline">Bookmarks</Link>
            <button
              onClick={handleLogout}
              className="bg-white text-orange-500 px-3 py-1 rounded hover:bg-orange-50 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link
              to="/register"
              className="bg-white text-orange-500 px-3 py-1 rounded hover:bg-orange-50 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
