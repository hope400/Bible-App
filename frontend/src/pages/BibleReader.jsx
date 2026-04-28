import { useState, useEffect, useRef } from 'react'
import { useBible } from '../context/BibleContext'
import Navbar from '../components/Navbar'
import './BibleReader.css'
import { useLocation, useNavigate } from 'react-router-dom'


const MOOD_SUGGESTIONS = [
  {
    title: 'Feeling Anxious?',
    desc: 'Find stillness in the promises of restoration and divine peace.',
    bookId: '1PE', chapterId: '1PE.5', verseNumber: 7, bookName: '1 Peter',
  },
  {
    title: 'In Need of Strength?',
    desc: 'Verses to bolster your spirit when the path feels long.',
    bookId: 'PHP', chapterId: 'PHP.4', verseNumber: 13, bookName: 'Philippians',
  },
  {
    title: 'Seeking Peace?',
    desc: 'Let the peace of God guard your heart and mind.',
    bookId: 'PHP', chapterId: 'PHP.4', verseNumber: 7, bookName: 'Philippians',
  },
  {
    title: 'Need Hope?',
    desc: 'His plans for you are good — a future full of hope.',
    bookId: 'JER', chapterId: 'JER.29', verseNumber: 11, bookName: 'Jeremiah',
  },
]

function BibleReader() {

const location = useLocation()
const navigate = useNavigate()
const {
  books, chapters, verses,
  currentBook, setCurrentBook,
  currentChapter, setCurrentChapter,
  loading, favorites, dailyVerse,
  highlights, notes,
  fetchBooks, fetchChapters, fetchChapterContent,
  toggleHighlight, toggleFavorite, saveNote,
} = useBible()

  const [activeTab,      setActiveTab]      = useState('LIBRARY')
  const [hoveredVerse,   setHoveredVerse]   = useState(null)
  const [activeNote,     setActiveNote]     = useState(null)
  const [noteInput,      setNoteInput]      = useState('')
  const highlightRef = useRef(null)

  // Auto-load chapter if navigated from dashboard
  useEffect(() => {
    const state = location.state
    if (state?.bookId && state?.chapterId) {
      loadFromState(state)
    } else {
      fetchBooks()
    }
  }, [])

  const loadFromState = async (state) => {
    await fetchBooks()
    await fetchChapters(state.bookId)
    await fetchChapterContent(state.chapterId)
    setCurrentBook({ id: state.bookId, name: state.bookName || state.bookId })
    setCurrentChapter({ id: state.chapterId, number: state.chapterNumber || '1' })
    setActiveTab('LIBRARY')

    // Scroll to verse 
    if (state.verseNumber) {
      setTimeout(() => {
        const el = document.getElementById(`verse-${state.verseNumber}`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 600)
    }
  }

  const handleBookSelect = async (book) => {
    setCurrentBook(book)
    setCurrentChapter(null)
    setVersesList([])
    await fetchChapters(book.id)
  }

  // workaround since verses is from context
  const setVersesList = () => {}

  const handleChapterSelect = async (chapter) => {
    setCurrentChapter(chapter)
    await fetchChapterContent(chapter.id)
  }

  const handleNoteOpen = (verseId) => {
    setActiveNote(verseId)
    setNoteInput(notes[verseId] || '')
  }

  const handleNoteSave = (verseId) => {
    saveNote(verseId, noteInput)
    setActiveNote(null)
  }

  const getVerseId = (number) =>
    `${currentChapter?.id}.${number}`

 const favList = Object.entries(favorites || {})

  const tabs = [
    { key: 'LIBRARY',     icon: '📚' },
    { key: 'DAILY VERSE', icon: '✨' },
    { key: 'BOOKMARKS',   icon: '🔖' },
   
    { key: 'JOURNAL',     icon: '📝' },
  ]

  return (
    <div className="reader-wrapper">
      <Navbar />
      <div className="reader-layout">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="reader-sidebar">
          <p className="sidebar-section-label">GOLDEN HOUR READING</p>

          <nav className="sidebar-nav">
            {tabs.map(t => (
              <button
                key={t.key}
                className={`sidebar-tab ${activeTab === t.key ? 'active' : ''}`}
             
onClick={() => {
  if (t.key === 'BOOKMARKS') { navigate('/favorites'); return }
  if (t.key === 'JOURNAL')   { navigate('/journal');   return }

if (t.key === 'DAILY VERSE') { navigate('/daily-verse'); return }
  setActiveTab(t.key)
  if (t.key === 'LIBRARY' && !books.length) fetchBooks()
}}
              >
                <span className="tab-icon">{t.icon}</span> {t.key}
              </button>
            ))}
          </nav>

          {/*  book list */}
          {activeTab === 'LIBRARY' && (
            <>
              <div className="book-list">
                {books.map(book => (
                  <button
                    key={book.id}
                    className={`book-item ${currentBook?.id === book.id ? 'active' : ''}`}
                    onClick={() => handleBookSelect(book)}
                  >
                    {book.name}
                  </button>
                ))}
              </div>

              {currentBook && chapters.length > 0 && (
                <div className="chapter-list">
                  <p className="chapter-list-label">CHAPTERS</p>
                  <div className="chapter-grid">
                    {chapters.filter(c => c.number !== 'intro').map(ch => (
                      <button
                        key={ch.id}
                        className={`chapter-btn ${currentChapter?.id === ch.id ? 'active' : ''}`}
                        onClick={() => handleChapterSelect(ch)}
                      >
                        {ch.number}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/*  favorites */}
          {activeTab === 'BOOKMARKS' && (
            <div className="bookmarks-list">
              {favList.length === 0 && (
                <p className="empty-msg">No favorites yet. Tap 🔖 on any verse!</p>
              )}
              {favList.map(([id, v]) => (
                <div key={id} className="bookmark-item">
                  <p className="bookmark-text">"{v.text.slice(0, 80)}…"</p>
                  <p className="bookmark-ref">{v.ref}</p>
                </div>
              ))}
            </div>
          )}

          {/* notes */}
          {activeTab === 'JOURNAL' && (
            <div className="bookmarks-list">
             {Object.entries(notes || {}).length === 0 && (
                <p className="empty-msg">No notes yet. Tap 📝 on any verse!</p>
              )}
             {Object.entries(notes || {}).map(([id, text]) => (
                <div key={id} className="bookmark-item">
                  <p className="bookmark-ref">{id}</p>
                  <p className="bookmark-text">{text}</p>
                </div>
              ))}
            </div>
          )}

     
<button
  className="start-reading-btn"
  onClick={() => {
    setActiveTab('LIBRARY')
    fetchBooks()
  }}
>
  START READING
</button>
        </aside>

       
        <main className="reader-main">
          {loading && <p className="reader-loading">Loading…</p>}

        {(!verses || !verses.length) && !loading && (
            <div className="reader-empty">
              <h2 className="reader-empty-title">Golden Hour Reading</h2>
              <p className="reader-empty-sub">Select a book and chapter from the sidebar to begin reading.</p>
            </div>
          )}

         {verses && verses.length > 0 && !loading && (
            <>
              <p className="reader-testament">{currentBook?.name?.toUpperCase()}</p>
              <h1 className="reader-chapter-title">
                {currentBook?.name} {currentChapter?.number}
              </h1>

              <div className="reader-verses">
                {verses.map(verse => {
                  const verseId = getVerseId(verse.number)
                  const isHighlighted = !!highlights[verseId]
                  const isFavorited  = !!favorites[verseId]
                  const hasNote      = !!notes[verseId]

                  return (
                    <div
                      key={verse.number}
                      id={`verse-${verse.number}`}
                      className={`verse-row ${isHighlighted ? 'highlighted' : ''}`}
                      onMouseEnter={() => setHoveredVerse(verse.number)}
                      onMouseLeave={() => setHoveredVerse(null)}
                    >
                      <span className="verse-number">{verse.number}</span>
                      <div className="verse-content">
                        <p className="verse-text-body">{verse.text}</p>

                        {hasNote && (
                          <p className="verse-note-preview">📝 {notes[verseId]}</p>
                        )}

                        {/* Note input */}
                        {activeNote === verseId && (
                          <div className="note-input-wrap">
                            <textarea
                              className="note-textarea"
                              placeholder="Write your reflection on this verse…"
                              value={noteInput}
                              onChange={e => setNoteInput(e.target.value)}
                            />
                            <div className="note-actions">
                              <button className="note-save-btn" onClick={() => handleNoteSave(verseId)}>Save</button>
                              <button className="note-cancel-btn" onClick={() => setActiveNote(null)}>Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Hover actions */}
                      <div className={`verse-actions ${hoveredVerse === verse.number ? 'visible' : ''}`}>
                        <button
                          className={`verse-action-btn ${isHighlighted ? 'active-highlight' : ''}`}
                          title="Highlight"
                          onClick={() => toggleHighlight(verseId)}
                        >✏️</button>
                        <button
                          className={`verse-action-btn ${isFavorited ? 'active-fav' : ''}`}
                          title="Favorite"
                          onClick={() => toggleFavorite(verseId, verse.text, `${currentBook?.name} ${currentChapter?.number}:${verse.number}`)}
                        >🔖</button>
                        <button
                          className={`verse-action-btn ${hasNote ? 'active-note' : ''}`}
                          title="Add Note"
                          onClick={() => handleNoteOpen(verseId)}
                        >📝</button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Chapter navigation */}
              <div className="reader-nav-footer">
                <button className="share-btn">📤 SHARE WITH A FRIEND</button>
                <div className="chapter-nav">
                  <button
                    className="chapter-nav-btn"
                    onClick={() => {
                      const idx = chapters.findIndex(c => c.id === currentChapter?.id)
                      if (idx > 1) handleChapterSelect(chapters[idx - 1])
                    }}
                  >
                    ← {currentBook?.name} {parseInt(currentChapter?.number) - 1}
                  </button>
                  <button
                    className="chapter-nav-btn"
                    onClick={() => {
                      const idx = chapters.findIndex(c => c.id === currentChapter?.id)
                      if (idx < chapters.length - 1) handleChapterSelect(chapters[idx + 1])
                    }}
                  >
                    {currentBook?.name} {parseInt(currentChapter?.number) + 1} →
                  </button>
                </div>
              </div>
            </>
          )}
        </main>

     
        <aside className="reader-right">
          <p className="right-section-label">SANCTUARY PLAYLISTS</p>
          <div className="playlist-card">
            <div className="playlist-art">🌅</div>
            <div>
              <p className="playlist-name">Golden Hour Ambient</p>
              <p className="playlist-vol">RESTORATION VOL. 1</p>
            </div>
          </div>
          <div className="playlist-controls">
            <button className="pl-btn">⇄</button>
            <button className="pl-btn">⏮</button>
            <button className="pl-btn play">▶</button>
            <button className="pl-btn">⏭</button>
            <button className="pl-btn">↻</button>
          </div>
          <div className="playlist-bar"><div className="playlist-progress"></div></div>
          <div className="playlist-times"><span>1:45</span><span>4:20</span></div>

          <div className="mood-suggestions">
            {MOOD_SUGGESTIONS.map((s, i) => (
              <div key={i} className="mood-suggestion-card">
                <h4 className="suggestion-title">{s.title}</h4>
                <p className="suggestion-desc">{s.desc}</p>
                
            <button
            className="suggestion-btn"
            onClick={() => {
                fetchChapters(s.bookId)
                fetchChapterContent(s.chapterId)
                setCurrentBook({ id: s.bookId, name: s.bookName })
                setCurrentChapter({ id: s.chapterId, number: s.chapterId.split('.')[1] })
                setTimeout(() => {
                const el = document.getElementById(`verse-${s.verseNumber}`)
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }, 800)
            }}
            >
            READ SELECTION →
            </button>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  )
}

export default BibleReader