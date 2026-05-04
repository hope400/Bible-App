import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import './Community.css'

const API_URL = import.meta.env.VITE_API_URL

function ToastContainer({ toasts, onClose }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.leaving ? 'toast-out' : ''}`}>
          <span className="toast-icon">{toast.icon || '🔔'}</span>
          <div className="toast-content">
            <p className="toast-title">{toast.title}</p>
            <p className="toast-message">{toast.message}</p>
          </div>
          <button className="toast-close" onClick={() => onClose(toast.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}


function Community() {
  const { user, token } = useAuth()

  const [posts,          setPosts]          = useState([])
  const [loading,        setLoading]        = useState(true)
  const [content,        setContent]        = useState('')
  const [verseRef,       setVerseRef]       = useState('')
  const [posting,        setPosting]        = useState(false)
  const [openComments,   setOpenComments]   = useState({})
  const [commentInputs,  setCommentInputs]  = useState({})


  const [memberCount,    setMemberCount]    = useState(0)
  const [liveMembers,    setLiveMembers]    = useState([])
  const [pulseItems,     setPulseItems]     = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  const [toasts,         setToasts]         = useState([])
  const toastIdRef = useRef(0)
  const socketRef  = useRef(null)

  const authHeader = useCallback(() => ({
    headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` }
  }), [token])

  const addToast = useCallback((icon, title, message) => {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev, { id, icon, title, message, leaving: false }])
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t))
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350)
    }, 4500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t))
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350)
  }, [])


  useEffect(() => {
    const socket = io(API_URL, { transports: ['websocket', 'polling'] })
    socketRef.current = socket

    socket.on('connect', () => {
     
      socket.emit('user:join', {
        name: user?.name || 'Anonymous',
        userId: user?._id
      })
    })

    socket.on('members:update', ({ count, members }) => {
      setMemberCount(count)
      setLiveMembers(members)
    })

    socket.on('activity:new', (activity) => {
      setPulseItems(prev => [activity, ...prev].slice(0, 15))
      setRecentActivity(prev => [activity, ...prev].slice(0, 6))
    })

    socket.on('post:created', (newPost) => {
      setPosts(prev => {
        if (prev.find(p => p._id === newPost._id)) return prev
        return [newPost, ...prev]
      })
      addToast('✨', 'New reflection shared',
        `${newPost.userId?.name || 'Someone'} just posted to the wall.`)
    })

    socket.on('post:deleted', ({ postId }) => {
      setPosts(prev => prev.filter(p => p._id !== postId))
    })

    socket.on('notification:new', (data) => {
      if (!data.targetUserId || data.targetUserId === user?._id) {
        addToast('❤️', 'Someone liked your post',
          data.message || 'Your reflection touched someone.')
      }
    })

    return () => socket.disconnect()
  }, [user, addToast])

  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/api/posts`, authHeader())
        setPosts(res.data)
      } catch (err) {
        console.error('Failed to load posts:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [authHeader])



const handlePost = async () => {
  if (!content.trim()) return
  setPosting(true)
  try {
    const res = await axios.post(`${API_URL}/api/posts`, { content, verseRef }, authHeader())
    
    setPosts(prev => {
      if (prev.find(p => p._id === res.data._id)) return prev
      return [res.data, ...prev]
    })
    setContent('')
    setVerseRef('')
  } catch (err) {
    addToast('⚠️', 'Could not post', 'Something went wrong. Try again.')
  } finally {
    setPosting(false)
  }
}

  const handleLike = async (postId) => {
    try {
      const res = await axios.put(`${API_URL}/api/posts/${postId}/like`, {}, authHeader())
      setPosts(prev => prev.map(p => p._id === postId ? res.data : p))
    } catch (err) {
      console.error('Like failed:', err)
    }
  }

const handleDelete = async (postId) => {
  try {
    setPosts(prev => prev.filter(p => p._id !== postId))
    await axios.delete(`${API_URL}/api/posts/${postId}`, authHeader())
    addToast('🗑️', 'Post removed', 'Your reflection has been deleted.')
  } catch (err) {
    console.error('Delete failed:', err)
    // Refetch if delete failed
    const res = await axios.get(`${API_URL}/api/posts`, authHeader())
    setPosts(res.data)
  }
}


const handleComment = async (postId) => {
  const text = commentInputs[postId]?.trim()
  if (!text) return
  const currentComments = posts.find(p => p._id === postId)?.comments || []
  const newComment = { userId: { name: user?.name || 'You', _id: user?._id }, text, _id: Date.now() }
  // Optimistic update
  setPosts(prev => prev.map(p =>
    p._id === postId ? { ...p, comments: [...currentComments, newComment] } : p
  ))
  setCommentInputs(prev => ({ ...prev, [postId]: '' }))
  try {
    const res = await axios.put(`${API_URL}/api/posts/${postId}`,
      { comments: [...currentComments, { userId: user?._id, text }] }, authHeader())
    setPosts(prev => prev.map(p => p._id === postId ? res.data : p))
    if (socketRef.current) {
      socketRef.current.emit('user:action', {
        action: 'commented on a reflection', icon: '💬'
      })
    }
  } catch (err) {
    console.error('Comment failed:', err)
  }
}

  
  const isLiked = (post) => {
    const userId = user?._id
    return post.likes?.some(id =>
      id === userId || id?.toString() === userId ||
      id?._id === userId || id?._id?.toString() === userId
    )
  }

  const isOwner = (post) => {
    const userId = user?._id
    return post.userId?._id === userId ||
           post.userId?._id?.toString() === userId ||
           post.userId === userId
  }

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
    if (diff < 60)    return `${diff}s ago`
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="community-wrapper">
      <Navbar />
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* ── PULSE BAR — 100% real activity ── */}
      <div className="pulse-bar">
        <div className="pulse-label">
          <div className="pulse-dot" />
          <span className="pulse-text">Sanctuary Pulse</span>
        </div>
        <div className="pulse-scroll">
          {/* Always show live count as first chip */}
          <div className="pulse-chip">
            <span className="pulse-chip-highlight">{memberCount}</span>
            &nbsp;member{memberCount !== 1 ? 's' : ''} live
          </div>
          {/* Real activity events */}
          {pulseItems.map((item, i) => (
            <div key={i} className="pulse-chip">
              {item.icon}&nbsp;
              <span className="pulse-chip-highlight">{item.name}</span>
              &nbsp;{item.action}
            </div>
          ))}
          {pulseItems.length === 0 && (
            <div className="pulse-chip" style={{ color: 'rgba(200,185,165,0.3)' }}>
              Waiting for activity…
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="community-body">

        {/* LEFT: FEED */}
        <div className="community-feed">
          <div className="community-feed-header">
            <h1 className="community-feed-title">The Reflection Wall</h1>
            <p className="community-feed-sub">
              A sanctuary for shared thoughts. Your words ripple through the archive.
            </p>
          </div>

          {loading && <p className="feed-loading">Loading reflections…</p>}

          {!loading && posts.length === 0 && (
            <div className="feed-empty">
              <div className="feed-empty-icon">🕊️</div>
              <h3 className="feed-empty-title">The wall awaits a first word</h3>
              <p className="feed-empty-sub">Share a verse or reflection — be the first to speak.</p>
            </div>
          )}

          {!loading && posts.map(post => (
            <article key={post._id} className="post-card">
              <div className="post-card-top">
                <div className="post-author">
                  <div className="post-avatar">{getInitials(post.userId?.name)}</div>
                  <div>
                    <div className="post-author-name">{post.userId?.name || 'Anonymous'}</div>
                    <div className="post-author-time">{timeAgo(post.createdAt)} · Reflection</div>
                  </div>
                </div>
                <button
                  className={`post-like-btn ${isLiked(post) ? 'liked' : ''}`}
                  onClick={() => handleLike(post._id)}
                >
                  <span className="heart">{isLiked(post) ? '♥' : '♡'}</span>
                  {post.likes?.length || 0}
                </button>
              </div>

              {post.verseRef && <p className="post-verse-ref">📖 {post.verseRef}</p>}
              <p className="post-content">"{post.content}"</p>

              {post.verseRef && (
                <div className="post-tags">
                  <span className="post-tag">#{post.verseRef.replace(/\s+/g,'').replace(/[^a-zA-Z0-9:]/g,'')}</span>
                  <span className="post-tag">#Reflection</span>
                </div>
              )}

              <div className="post-actions">
                <button className="post-action-btn" onClick={() =>
                  setOpenComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))
                }>
                  💬 {post.comments?.length || 0} comments
                </button>
                {isOwner(post) && (
                  <button className="post-action-btn delete" onClick={() => handleDelete(post._id)}>
                    🗑 Delete
                  </button>
                )}
              </div>

              {openComments[post._id] && (
                <div className="post-comments">
                  {(post.comments || []).map((c, i) => (
                    <div key={c._id || i} className="comment-item">
                      <div className="comment-avatar">{getInitials(c.userId?.name)}</div>
                      <div className="comment-body">
                        <div className="comment-author">{c.userId?.name || 'Anonymous'}</div>
                        <div className="comment-text">{c.text}</div>
                      </div>
                    </div>
                  ))}
                  <div className="comment-input-row">
                    <input
                      className="comment-input"
                      placeholder="Add a reflection…"
                      value={commentInputs[post._id] || ''}
                      onChange={e => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleComment(post._id)}
                    />
                    <button className="comment-submit-btn" onClick={() => handleComment(post._id)}>
                      Send
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* RIGHT: SIDEBAR */}
        <aside className="community-sidebar">

          {/* Compose */}
          <div className="compose-box">
            <h3 className="compose-title">Share a Reflection</h3>
            <textarea
              className="compose-textarea"
              placeholder="What is the Word speaking to you tonight?"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <input
              className="compose-verse-input"
              type="text"
              placeholder="Verse reference (e.g. John 3:16)"
              value={verseRef}
              onChange={e => setVerseRef(e.target.value)}
            />
            <button
              className="compose-submit-btn"
              onClick={handlePost}
              disabled={posting || !content.trim()}
            >
              ✦ {posting ? 'Posting…' : 'Post to Archive'}
            </button>
          </div>

          {/* REAL Live Activity */}
          <div className="live-box">
            <div className="live-box-header">
              <span className="live-box-title">Live Activity</span>
              <span className="live-badge">Real-Time</span>
            </div>
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((a, i) => (
                <div key={i} className="live-member-row">
                  <div className="live-member-avatar">
                    {getInitials(a.name)}
                    <div className="live-member-status" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="live-member-name">{a.name}</div>
                    <div className="live-member-action">{a.action}</div>
                  </div>
                  <span style={{ fontSize: '1rem' }}>{a.icon}</span>
                </div>
              ))
            ) : (
              <p style={{
                fontSize: '0.75rem', color: 'rgba(200,185,165,0.3)',
                fontStyle: 'italic', textAlign: 'center', padding: '1rem 0'
              }}>
                Activity will appear here in real time…
              </p>
            )}
          </div>

          {/* REAL Members Live */}
          <div className="community-mood-card">
            <p className="mood-card-eyebrow">Members Live Now</p>
            <h4 className="mood-card-title">
              {memberCount > 0
                ? `${memberCount} Soul${memberCount !== 1 ? 's' : ''} Present`
                : 'The Sanctuary Awaits'
              }
            </h4>
            <p className="mood-card-sub">
              {liveMembers.length > 0
                ? `${liveMembers.map(m => m.name.split(' ')[0]).slice(0, 3).join(', ')}${liveMembers.length > 3 ? ` and ${liveMembers.length - 3} more` : ''} are here.`
                : 'Open the sanctuary and be the first light.'
              }
            </p>
            <div className="members-live-count">
              <div className="members-live-dot" />
              <span className="members-live-text">
                {memberCount > 0
                  ? `${memberCount} member${memberCount !== 1 ? 's' : ''} connected`
                  : 'No one else connected yet'
                }
              </span>
            </div>
            {/* REAL list of connected users */}
            {liveMembers.length > 0 && (
              <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {liveMembers.slice(0, 5).map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #d4956a, #8b4513)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.55rem', color: '#fff', fontWeight: 600
                    }}>
                      {getInitials(m.name)}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(200,185,165,0.55)' }}>
                      {m.name}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(200,185,165,0.28)', flex: 1, textAlign: 'right' }}>
                      {m.action}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      <footer style={{
        textAlign: 'center', padding: '2.5rem 1rem',
        borderTop: '1px solid rgba(82,67,67,0.15)', marginTop: '2rem'
      }}>
        <p style={{
          fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
          fontSize: '0.82rem', color: 'rgba(200,185,165,0.25)'
        }}>
          "Where two or three gather in my name, there am I with them." — Matthew 18:20
        </p>
      </footer>
    </div>
  )
}

export default Community
