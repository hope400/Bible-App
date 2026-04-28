import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBible } from '../context/BibleContext'
import Navbar from '../components/Navbar'
import './Favorites.css'

function Favorites() {
  const { favorites, toggleFavorite } = useBible()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const favList = Object.entries(favorites || {})

  const filtered = favList.filter(([id, v]) =>
    v.text?.toLowerCase().includes(search.toLowerCase()) ||
    v.ref?.toLowerCase().includes(search.toLowerCase())
  )

  const goToVerse = (id) => {
    // id format is like PSA.23.1 — extract book and chapter
    const parts = id.split('.')
    if (parts.length >= 2) {
      const bookId    = parts[0]
      const chapterId = `${parts[0]}.${parts[1]}`
      const verseNum  = parseInt(parts[2]) || 1
      navigate('/bible', { state: { bookId, chapterId, verseNumber: verseNum, bookName: bookId } })
    } else {
      navigate('/bible')
    }
  }

  return (
    <div className="favorites-page">
      <Navbar />

      {/* ── HEADER ── */}
      <div className="fav-header">
        <button className="fav-back" onClick={() => navigate('/')}>← Back</button>
        <div className="fav-header-center">
          <p className="fav-eyebrow">YOUR COLLECTION</p>
          <h1 className="fav-title">Favorite Verses</h1>
          <p className="fav-subtitle">{favList.length} verse{favList.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {/* ── SEARCH ── */}
      {favList.length > 0 && (
        <div className="fav-search-bar">
          <span>🔍</span>
          <input
            className="fav-search"
            type="text"
            placeholder="Search your favorites…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="fav-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {favList.length === 0 && (
        <div className="fav-empty">
          <p className="fav-empty-icon">🔖</p>
          <h3 className="fav-empty-title">No favorites yet</h3>
          <p className="fav-empty-sub">
            Open the Bible reader, hover any verse,<br />
            and tap 🔖 to save it here.
          </p>
          <button className="fav-empty-btn" onClick={() => navigate('/bible')}>
            Open Bible Reader →
          </button>
        </div>
      )}

      {/* ── LIST ── */}
      <div className="fav-list">
        {filtered.map(([id, v], i) => (
          <div key={id} className="fav-item">
            <div className="fav-item-number">{String(i + 1).padStart(2, '0')}</div>
            <div className="fav-item-body">
              <p className="fav-item-text">"{v.text}"</p>
              <p className="fav-item-ref">{v.ref}</p>
            </div>
            <div className="fav-item-actions">
              <button
                className="fav-read-btn"
                onClick={() => goToVerse(id)}
              >
                Read →
              </button>
              <button
                className="fav-remove-btn"
                onClick={() => toggleFavorite(id, v.text, v.ref)}
                title="Remove from favorites"
              >
                🔖
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && search && (
          <p className="fav-no-results">No results for "{search}"</p>
        )}
      </div>

      <footer className="fav-footer">
        <p>"I have stored up your word in my heart." — Psalm 119:11</p>
      </footer>
    </div>
  )
}

export default Favorites