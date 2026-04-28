import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import './Journal.css'

const API_URL = import.meta.env.VITE_API_URL

function Journal() {
  const { token }    = useAuth()
  const navigate     = useNavigate()
  const location     = useLocation()

  const [entries,       setEntries]      = useState([])
  const [loading,       setLoading]      = useState(true)
  const [searchQuery,   setSearchQuery]  = useState('')
  const [editingId,     setEditingId]    = useState(null)
  const [editText,      setEditText]     = useState('')
  const [editTitle,     setEditTitle]    = useState('')
  const [expandedId,    setExpandedId]   = useState(null)
  const [showNewEntry,  setShowNewEntry] = useState(false)
  const [newEntryText,  setNewEntryText] = useState('')
  const [newEntryTitle, setNewEntryTitle]= useState('')
  const [newEntryMood,  setNewEntryMood] = useState('')

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` }
  })

  useEffect(() => {
    fetchEntries()
    if (location.state?.openNew) setShowNewEntry(true)
  }, [])

  const fetchEntries = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/api/journals`, getAuthHeader())
      setEntries(res.data)
    } catch (err) {
      console.error('Failed to fetch journals:', err)
    } finally {
      setLoading(false)
    }
  }

  const saveNewEntry = async () => {
    if (!newEntryText.trim()) return
    try {
      const res = await axios.post(`${API_URL}/api/journals`, {
        title:     newEntryTitle || 'Untitled',
        body:      newEntryText,
        mood:      newEntryMood,
        verseRef:  '',
        isPrivate: true,
      }, getAuthHeader())
      setEntries(prev => [res.data, ...prev])
      setNewEntryText('')
      setNewEntryTitle('')
      setNewEntryMood('')
      setShowNewEntry(false)
    } catch (err) {
      console.error('Failed to save entry:', err)
    }
  }

  const handleEdit = (entry) => {
    setEditingId(entry._id)
    setEditText(entry.body)
    setEditTitle(entry.title)
    setExpandedId(entry._id)
  }

  const handleSave = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/api/journals/${id}`, {
        title: editTitle,
        body:  editText,
      }, getAuthHeader())
      setEntries(prev => prev.map(e => e._id === id ? res.data : e))
      setEditingId(null)
    } catch (err) {
      console.error('Failed to update entry:', err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/journals/${id}`, getAuthHeader())
      setEntries(prev => prev.filter(e => e._id !== id))
      if (expandedId === id) setExpandedId(null)
    } catch (err) {
      console.error('Failed to delete entry:', err)
    }
  }

  const filtered = entries.filter(e =>
    e.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.verseRef?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const wordCount = (text) => text?.trim().split(/\s+/).filter(Boolean).length || 0
  const totalWords = entries.reduce((acc, e) => acc + wordCount(e.body), 0)

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })

  return (
    <div className="journal-wrapper">
      <Navbar />

      {/* ── HEADER ── */}
      <div className="journal-header">
        <div className="journal-header-left">
          <p className="journal-eyebrow">YOUR REFLECTIONS</p>
          <h1 className="journal-title">The Journal</h1>
          <p className="journal-subtitle">Words between you and the Word.</p>
        </div>
        <div className="journal-stats">
          <div className="journal-stat">
            <span className="journal-stat-number">{entries.length}</span>
            <span className="journal-stat-label">Entries</span>
          </div>
          <div className="journal-stat-divider" />
          <div className="journal-stat">
            <span className="journal-stat-number">{totalWords}</span>
            <span className="journal-stat-label">Words Written</span>
          </div>
        </div>
      </div>

      {/* ── NEW ENTRY BUTTON ── */}
      <div className="journal-new-wrap">
        <button
          className="journal-new-btn"
          onClick={() => setShowNewEntry(!showNewEntry)}
        >
          {showNewEntry ? '✕ Cancel' : '✦ New Entry'}
        </button>
      </div>

      {/* ── NEW ENTRY FORM ── */}
      {showNewEntry && (
        <div className="new-entry-form">
          <div className="new-entry-top">
            <span className="new-entry-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <input
            className="new-entry-title-input"
            type="text"
            placeholder="Title — A Prayer, A Thought, A Gratitude…"
            value={newEntryTitle}
            onChange={e => setNewEntryTitle(e.target.value)}
          />
          <textarea
            className="new-entry-textarea"
            placeholder="Write freely here. This is your space…"
            value={newEntryText}
            onChange={e => setNewEntryText(e.target.value)}
            autoFocus
          />
          <div className="new-entry-actions">
            <div className="new-entry-prompts">
              <span className="prompt-label">Need a prompt?</span>
              <button className="prompt-chip" onClick={() => { setNewEntryTitle('Prayer'); setNewEntryMood('Anxious') }}>🙏 Prayer</button>
              <button className="prompt-chip" onClick={() => { setNewEntryTitle('Gratitude'); setNewEntryMood('Grateful') }}>🌸 Gratitude</button>
              <button className="prompt-chip" onClick={() => { setNewEntryTitle('Reflection'); setNewEntryMood('Seeking') }}>💭 Reflection</button>
              <button className="prompt-chip" onClick={() => { setNewEntryTitle('Confession'); setNewEntryMood('Peaceful') }}>🕊️ Confession</button>
            </div>
            <button className="new-entry-save" onClick={saveNewEntry}>
              Save Entry →
            </button>
          </div>
        </div>
      )}

      {/* ── SEARCH ── */}
      <div className="journal-search-bar">
        <span className="search-icon">🔍</span>
        <input
          className="journal-search"
          type="text"
          placeholder="Search your reflections…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
        )}
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <p style={{ textAlign: 'center', color: 'rgba(200,185,165,0.35)', fontStyle: 'italic', padding: '3rem' }}>
          Loading your journal…
        </p>
      )}

      {/* ── EMPTY STATE ── */}
      {!loading && entries.length === 0 && (
        <div className="journal-empty">
          <p className="journal-empty-icon">📖</p>
          <h3 className="journal-empty-title">Your journal is waiting</h3>
          <p className="journal-empty-sub">
            Write a new entry above, or go to the Bible reader,<br />
            hover over any verse and tap 📝 to reflect.
          </p>
          <button className="journal-empty-btn" onClick={() => navigate('/bible')}>
            Open Bible Reader →
          </button>
        </div>
      )}

      {/* ── ENTRIES ── */}
      {!loading && (
        <div className="journal-entries">
          {filtered.map((entry, i) => (
            <div
              key={entry._id}
              className={`journal-entry ${expandedId === entry._id ? 'expanded' : ''}`}
            >
              {/* Ribbon */}
              <div className="entry-ribbon">
                <span className="entry-number">{String(entries.length - i).padStart(2, '0')}</span>
                <span className={`entry-type-dot ${entry.mood ? 'verse' : 'free'}`} />
              </div>

              {/* Body */}
              <div
                className="entry-body"
                onClick={() => setExpandedId(expandedId === entry._id ? null : entry._id)}
              >
                <div className="entry-top">
                  <div>
                    <p className="entry-ref">{entry.title}</p>
                    <p className="entry-date">{formatDate(entry.createdAt)}</p>
                    {entry.mood && (
                      <p className="entry-date" style={{ color: '#b8913a', marginTop: '0.15rem' }}>
                        {entry.mood}
                      </p>
                    )}
                  </div>
                  <div className="entry-meta-right">
                    <span className="entry-word-count">{wordCount(entry.body)} words</span>
                    <span className="entry-chevron">{expandedId === entry._id ? '∧' : '∨'}</span>
                  </div>
                </div>

                {/* Verse ref */}
                {entry.verseRef && (
                  <div className="entry-verse-snippet">
                    <span className="entry-verse-bar" />
                    <p className="entry-verse-text">{entry.verseRef}</p>
                  </div>
                )}

                {/* Preview */}
                {expandedId !== entry._id && (
                  <p className="entry-note-preview">
                    {entry.body.slice(0, 120)}{entry.body.length > 120 ? '…' : ''}
                  </p>
                )}

                {/* Full text */}
                {expandedId === entry._id && editingId !== entry._id && (
                  <p className="entry-note-full">{entry.body}</p>
                )}

                {/* Edit mode */}
                {editingId === entry._id && (
                  <div onClick={e => e.stopPropagation()}>
                    <input
                      className="new-entry-title-input"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      style={{ marginBottom: '0.75rem' }}
                    />
                    <textarea
                      className="entry-edit-textarea"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              {expandedId === entry._id && (
                <div className="entry-actions" onClick={e => e.stopPropagation()}>
                  {editingId === entry._id ? (
                    <>
                      <button className="entry-btn save" onClick={() => handleSave(entry._id)}>
                        Save Changes
                      </button>
                      <button className="entry-btn cancel" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="entry-btn edit" onClick={() => handleEdit(entry)}>
                        ✏️ Edit
                      </button>
                      {entry.verseRef && (
                        <button className="entry-btn go" onClick={() => navigate('/bible')}>
                          📖 Go to verse
                        </button>
                      )}
                      <button className="entry-btn delete" onClick={() => handleDelete(entry._id)}>
                        🗑 Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && searchQuery && (
            <p className="no-results">No entries matching "{searchQuery}"</p>
          )}
        </div>
      )}

      <footer className="journal-footer">
        <p>"Write the vision; make it plain on tablets." — Habakkuk 2:2</p>
      </footer>
    </div>
  )
}

export default Journal