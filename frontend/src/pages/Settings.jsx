import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import './Settings.css'

const API_URL = import.meta.env.VITE_API_URL

const THEMES = [
  { id: 'sunset', name: 'Sunset Sanctuary', description: 'Warm amber & twilight warmth',    gradient: 'linear-gradient(135deg, #c4794a 0%, #6a3020 55%, #0d0b09 100%)', sample: '#d4956a' },
  { id: 'forest', name: 'Forest Sanctuary', description: 'Ancient greens & earthy depths',  gradient: 'linear-gradient(135deg, #3a7a3a 0%, #1a4a1a 55%, #080e09 100%)', sample: '#74b874' },
  { id: 'ocean',  name: 'Ocean Depths',     description: 'Deep blue & coastal stillness',   gradient: 'linear-gradient(135deg, #1a5a8a 0%, #0a2d5a 55%, #06090f 100%)', sample: '#5a9fd4' },
]

function applyTheme(themeId) {
  document.documentElement.classList.remove('theme-sunset', 'theme-forest', 'theme-ocean')
  document.documentElement.classList.add(`theme-${themeId}`)
  localStorage.setItem('bibble-theme', themeId)
}

function Settings() {
  const { user, login, logout, token } = useAuth()
  const navigate = useNavigate()

  const [name,            setName]            = useState(user?.name  || '')
  const [email,           setEmail]           = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword,     setNewPassword]     = useState('')
  const [showPassFields,  setShowPassFields]  = useState(false)
  const [activeTheme,     setActiveTheme]     = useState(() => localStorage.getItem('bibble-theme') || 'sunset')
  const [streakReminder,  setStreakReminder]  = useState(() => localStorage.getItem('bibble-streak-reminder') !== 'false')
  const [communityNotif,  setCommunityNotif]  = useState(() => localStorage.getItem('bibble-community-notif') === 'true')
  const [reminderTime,    setReminderTime]    = useState(() => localStorage.getItem('bibble-reminder-time') || '19:30')
  const [saving,   setSaving]   = useState(false)
  const [success,  setSuccess]  = useState('')
  const [error,    setError]    = useState('')
  const [notifPermission, setNotifPermission] = useState(Notification.permission)

  useEffect(() => { applyTheme(activeTheme) }, [])

  const handleThemeSelect = (themeId) => {
    setActiveTheme(themeId)
    applyTheme(themeId)
  }

  // ── Real notification permission handler ─────────────────────
  const handleStreakToggle = async () => {
    const newValue = !streakReminder

    if (newValue) {
      if (Notification.permission === 'default') {
        const result = await Notification.requestPermission()
        setNotifPermission(result)

        if (result === 'granted') {
          setStreakReminder(true)
          new Notification('Bibble reminders enabled ✓', {
            body: `You'll be reminded daily at ${formatTime(reminderTime)}`,
            icon: '/favicon.svg',
          })
        } else {
          setError('Notifications blocked. Go to your browser settings → allow notifications for this site.')
          return // don't turn on
        }
      } else if (Notification.permission === 'granted') {
        setStreakReminder(true)
        new Notification('Bibble reminders active ✓', {
          body: `Daily reminder set for ${formatTime(reminderTime)}`,
          icon: '/favicon.svg',
        })
      } else {
        setError('Notifications are blocked by your browser. To fix: click the 🔒 icon in the address bar → allow notifications.')
        return
      }
    } else {
      setStreakReminder(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const payload = { name, email }
      if (showPassFields && newPassword) {
        payload.currentPassword = currentPassword
        payload.newPassword = newPassword
      }
      const res = await axios.put(
        `${API_URL}/api/auth/profile`, payload,
        { headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` } }
      )
      login(res.data, res.data.token)
      localStorage.setItem('bibble-theme',           activeTheme)
      localStorage.setItem('bibble-streak-reminder', String(streakReminder))
      localStorage.setItem('bibble-community-notif', String(communityNotif))
      localStorage.setItem('bibble-reminder-time',   reminderTime)
      setCurrentPassword('')
      setNewPassword('')
      setShowPassFields(false)
      setSuccess('Your settings have been saved.')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setActiveTheme('sunset'); applyTheme('sunset')
    setStreakReminder(true); setCommunityNotif(false); setReminderTime('19:30')
    localStorage.removeItem('bibble-theme')
    localStorage.removeItem('bibble-streak-reminder')
    localStorage.removeItem('bibble-community-notif')
    localStorage.removeItem('bibble-reminder-time')
    setSuccess('Reset to defaults.')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const formatTime = (t) => {
    if (!t) return ''
    const [h, m] = t.split(':')
    const hr = parseInt(h)
    const ampm = hr >= 12 ? 'PM' : 'AM'
    return `${hr % 12 || 12}:${m} ${ampm}`
  }

  return (
    <div className="settings-wrapper">
      <Navbar />
      <main className="settings-main">

        <header className="settings-header">
          <div className="settings-header-inner">
            <div className="settings-header-text">
              <p className="settings-eyebrow">YOUR ARCHIVE</p>
              <h1 className="settings-title">Settings</h1>
              <p className="settings-subtitle">
                Curate your environment to match your spiritual pace and visual preference.
              </p>
            </div>
            <div className="settings-header-accent" />
          </div>
        </header>

        {success && <div className="settings-toast success">✓ {success}</div>}
        {error   && <div className="settings-toast error">⚠ {error}</div>}

        {/* PROFILE */}
        <section className="settings-section">
          <div className="section-head">
            <span className="section-icon">👤</span>
            <h2 className="section-title">Profile Identity</h2>
          </div>
          <div className="profile-grid">
            <div className="profile-avatar-col">
              <div className="profile-avatar-circle">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <p className="profile-avatar-hint">Your display initial</p>
            </div>
            <div className="profile-fields">
              <div className="field-group">
                <label className="field-label">DISPLAY NAME</label>
                <input className="field-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="field-group">
                <label className="field-label">EMAIL ADDRESS</label>
                <input className="field-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
              </div>
              <button className="change-password-toggle" onClick={() => setShowPassFields(!showPassFields)}>
                {showPassFields ? '✕ Cancel' : '🔑 Change password'}
              </button>
              {showPassFields && (
                <div className="password-fields">
                  <div className="field-group">
                    <label className="field-label">CURRENT PASSWORD</label>
                    <input className="field-input" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                  </div>
                  <div className="field-group">
                    <label className="field-label">NEW PASSWORD</label>
                    <input className="field-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* APPEARANCE */}
        <section className="settings-section">
          <div className="section-head">
            <span className="section-icon">🎨</span>
            <h2 className="section-title">Appearance</h2>
          </div>
          <p className="section-hint">Changes apply instantly across the entire app.</p>
          <div className="theme-grid">
            {THEMES.map(theme => (
              <button key={theme.id} className={`theme-card ${activeTheme === theme.id ? 'active' : ''}`} onClick={() => handleThemeSelect(theme.id)}>
                <div className="theme-preview" style={{ background: theme.gradient }}>
                  {activeTheme === theme.id && <div className="theme-check">✓</div>}
                </div>
                <div className="theme-info">
                  <div className="theme-dot" style={{ background: theme.sample }} />
                  <div>
                    <p className="theme-name">{theme.name}</p>
                    <p className="theme-description">{theme.description}</p>
                  </div>
                </div>
                {activeTheme === theme.id && <span className="theme-active-badge">Active</span>}
              </button>
            ))}
          </div>
        </section>

        {/* NOTIFICATIONS */}
        <section className="settings-section">
          <div className="section-head">
            <span className="section-icon">🔔</span>
            <h2 className="section-title">Notifications</h2>
          </div>

          {/* Show browser permission status */}
          {notifPermission === 'denied' && (
            <div className="notif-blocked-banner">
              🚫 Browser notifications are blocked. Click the 🔒 in your address bar → allow notifications for this site, then refresh.
            </div>
          )}
          {notifPermission === 'granted' && (
            <div className="notif-granted-banner">
              ✓ Browser notifications are active on this device.
            </div>
          )}

          <div className="notif-list">
            <div className="notif-row">
              <div className="notif-text">
                <p className="notif-name">Daily Streak Reminders</p>
                <p className="notif-desc">
                  A browser notification appears at your chosen time — even if the app is in the background.
                </p>
              </div>
              <button className={`toggle ${streakReminder ? 'on' : 'off'}`} onClick={handleStreakToggle}>
                <div className="toggle-thumb" />
              </button>
            </div>

            <div className={`notif-row ${!communityNotif ? 'dimmed' : ''}`}>
              <div className="notif-text">
                <p className="notif-name">Community Activity</p>
                <p className="notif-desc">In-app alerts when someone likes or replies to your reflection.</p>
              </div>
              <button className={`toggle ${communityNotif ? 'on' : 'off'}`} onClick={() => setCommunityNotif(!communityNotif)}>
                <div className="toggle-thumb" />
              </button>
            </div>

            <div className="reminder-time-row">
              <div className="notif-text">
                <label className="field-label">GENTLE HOUR REMINDER</label>
                <p className="notif-desc">
                  Notification will appear at{' '}
                  <span className="reminder-time-display">{formatTime(reminderTime)}</span>
                  {' '}— pick any time below.
                </p>
              </div>
              <input
                type="time"
                className="time-picker"
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ACCOUNT */}
        <section className="settings-section">
          <div className="section-head">
            <span className="section-icon">🚪</span>
            <h2 className="section-title">Account</h2>
          </div>
          <div className="account-row">
            <div className="notif-text">
              <p className="notif-name">Sign Out</p>
              <p className="notif-desc">You'll need to log in again to access your archive.</p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
          </div>
        </section>

        {/* FOOTER */}
        <div className="settings-footer">
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button className="reset-btn" onClick={handleReset}>
            Reset to Defaults
          </button>
        </div>

      </main>
    </div>
  )
}

export default Settings