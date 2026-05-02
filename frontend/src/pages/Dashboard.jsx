import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBible, MOOD_VERSES } from '../context/BibleContext'
import Navbar from '../components/Navbar'
import './Dashboard.css'

const MOODS = ['Peaceful', 'Joyful', 'Seeking', 'Anxious', 'Grateful']

function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function getYesterdayKey() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function computeStreak() {
  const today     = getTodayKey()
  const yesterday = getYesterdayKey()
  const last      = localStorage.getItem('bibble-last-visit')
  let   streak    = parseInt(localStorage.getItem('bibble-streak') || '0')
  if (last === today)      return streak
  if (last === yesterday)  streak += 1
  else                     streak = 1
  localStorage.setItem('bibble-last-visit', today)
  localStorage.setItem('bibble-streak', String(streak))
  return streak
}

function getStreakDots(streak) {
  const visited = JSON.parse(localStorage.getItem('bibble-visited-days') || '[]')
  const today   = getTodayKey()
  if (!visited.includes(today)) {
    visited.push(today)
    if (visited.length > 30) visited.shift()
    localStorage.setItem('bibble-visited-days', JSON.stringify(visited))
  }
  return visited.slice(-7)
}

function Dashboard() {
  const { user }                         = useAuth()

const { dailyVerse, dailyVerseText, fetchDailyVerse, favorites, notes } = useBible()
  const navigate                         = useNavigate()

  const [selectedMood, setSelectedMood] = useState('Seeking')
  const [streak,       setStreak]       = useState(0)
  const [streakDots,   setStreakDots]   = useState([])
  const [favList,      setFavList]      = useState([])
  const [noteCount,    setNoteCount]    = useState(0)


  useEffect(() => {
    const s = computeStreak()
    setStreak(s)
    setStreakDots(getStreakDots(s))
    fetchDailyVerse()
  }, [])

  useEffect(() => {
    const entries = Object.entries(favorites || {})
    setFavList(entries.slice(0, 3))
  }, [favorites])

  useEffect(() => {
    const verseNotes = Object.keys(notes || {}).length
    let freeNotes = 0
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i)?.startsWith('bibble-free-note-')) freeNotes++
    }
    setNoteCount(verseNotes + freeNotes)
  }, [notes])

  const goToVerse = (bookId, chapterId, verseNumber) => {
    navigate('/bible', { state: { bookId, chapterId, verseNumber, bookName: bookId } })
  }

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric'
  }).toUpperCase()

  const nextBadge   = streak < 3 ? 3 : streak < 7 ? 7 : streak < 30 ? 30 : streak < 100 ? 100 : null
  const toNextBadge = nextBadge ? nextBadge - streak : 0

  return (
    <div className="dashboard">
      <Navbar />

    
      <div
        className="dashboard-hero"
        onClick={() => navigate('/daily-verse')}
        title="View daily verse calendar"
      >
        <p className="hero-label">DAILY VERSE — {today}</p>

        <h1 className="hero-verse">"{dailyVerseText || dailyVerse.ref}"</h1>
        <p className="hero-ref">{dailyVerse.ref.toUpperCase()}</p>
        <p className="hero-cta">VIEW VERSE CALENDAR →</p>
      </div>

      {/* ── BODY ── */}
      <div className="dashboard-body">

        <div className="dashboard-main">

          <h2 className="mood-heading">How are you feeling?</h2>
          <div className="mood-pills">
            {MOODS.map(mood => (
              <button
                key={mood}
                className={`mood-pill ${selectedMood === mood ? 'active' : ''}`}
                onClick={() => setSelectedMood(mood)}
              >
                {mood}
              </button>
            ))}
          </div>

          <div className="verse-cards">
            {MOOD_VERSES[selectedMood].map((v, i) => (
              <div
                key={i}
                className="verse-card"
                onClick={() => goToVerse(v.bookId, v.chapterId, v.verseNumber)}
                title="Read in Bible"
              >
                <span className="verse-card-icon">📖</span>
                <p className="verse-card-text">{v.text}</p>
                <p className="verse-card-ref">{v.ref}</p>
                <p className="verse-card-link">READ →</p>
              </div>
            ))}
          </div>

          <div className="favorites-section">
            <div className="favorites-header">
              <h3 className="favorites-title">Favorite Verses</h3>
              <button className="view-all-btn" onClick={() => navigate('/favorites')}>
                VIEW ALL
              </button>
            </div>

            {favList.length === 0 ? (
              <div className="favorites-empty">
                <p className="favorites-empty-text">
                  No favorites yet — open the Bible reader and tap 🔖 on any verse.
                </p>
                <button className="favorites-empty-btn" onClick={() => navigate('/bible')}>
                  Go to Bible →
                </button>
              </div>
            ) : (
              favList.map(([id, v]) => (
                <div
                  key={id}
                  className="favorite-item"
                  onClick={() => navigate('/favorites')}
                  title="View all favorites"
                >
                  <div>
                    <p className="favorite-text">
                      "{v.text.length > 80 ? v.text.slice(0, 80) + '…' : v.text}"
                    </p>
                    <p className="favorite-ref">{v.ref}</p>
                  </div>
                  <span className="bookmark-icon">🔖</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="dashboard-sidebar">

          <div className="sidebar-card">
            <p className="sidebar-label">ACTIVE STREAK</p>
            <div className="streak-display">
              <span className="streak-number">{streak}</span>
              <span className="streak-unit">Day{streak !== 1 ? 's' : ''}</span>
            </div>
            <div className="streak-week">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`streak-dot ${i < Math.min(streak, 7) ? 'filled' : 'empty'}`}
                />
              ))}
            </div>
            {nextBadge && (
              <p className="streak-next">
                🏅 {toNextBadge} day{toNextBadge !== 1 ? 's' : ''} to {nextBadge}-day badge
              </p>
            )}
            {streak >= 100 && (
              <p className="streak-next">🎖️ Century streak achieved!</p>
            )}
          </div>

          
        <div className="sidebar-card">
          <p className="sidebar-label">SANCTUARY MUSIC</p>
          <div className="player-track">
            <div className="player-art">🌅</div>
            <div>
              <p className="player-title">Morning Worship</p>
              <p className="player-artist">PEACEFUL · GOLDEN HOUR</p>
            </div>
          </div>
          <iframe
            width="100%"
            height="120"
            // NEW:
src="https://www.youtube.com/embed/yhFccHgf_FQ?rel=0"
            allow="encrypted-media"
            allowFullScreen
            style={{ border: 'none', borderRadius: '10px', marginTop: '0.75rem' }}
          />
          <button
            className="reflection-btn-secondary"
            style={{ marginTop: '0.6rem' }}
            onClick={() => navigate('/library')}
          >
            View All Playlists →
          </button>
        </div>

          <div className="sidebar-card journal-card">
            <div className="journal-card-top">
              <h3 className="reflection-title">Today's Reflection</h3>
              {noteCount > 0 && <span className="journal-count">{noteCount}</span>}
            </div>
            <p className="reflection-prompt">
              {noteCount === 0
                ? 'How did you find peace in the chaos today?'
                : `You have ${noteCount} journal entr${noteCount === 1 ? 'y' : 'ies'}.`
              }
            </p>
            <div className="journal-card-btns">
              <button className="reflection-btn" onClick={() => navigate('/journal')}>
                {noteCount === 0 ? 'START JOURNALING' : 'VIEW JOURNAL'}
              </button>
              {noteCount > 0 && (
                <button
                  className="reflection-btn-secondary"
                  onClick={() => navigate('/journal', { state: { openNew: true } })}
                >
                  + NEW ENTRY
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      <footer className="dashboard-footer">
        <div className="footer-links">
          <span>Privacy</span><span>Terms</span><span>Support</span>
        </div>
        <p>© 2024 Bibble - The Sunset Sanctuary</p>
      </footer>
    </div>
  )
}

export default Dashboard