import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { label: 'Scripture', path: '/bible' },
    { label: 'Library', path: '/library' },
    { label: 'Journal', path: '/journal' },
    { label: 'Community', path: '/community' },
  ]

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Bibble</Link>

      <div className="navbar-links">
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="navbar-right">
        <button className="nav-icon-btn" title="Streak">🔥</button>
        <button className="nav-icon-btn" title="Settings">⚙️</button>
        <div className="nav-avatar" onClick={handleLogout} title="Logout">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </nav>
  )
}

export default Navbar