import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, { name, email, password })
      login(res.data, res.data.token)
      navigate('/')
    } catch (err) {
      setError('Something went wrong. Try a different email.')
    }
  }

  return (
    <div className="auth-wrapper">

      {/* ── LEFT ── */}
      <div className="auth-left">
        <div>
          <h1 className="auth-brand">Bibble</h1>
          <p className="auth-tagline">
            Find stillness in the Word and<br />rhythm in your soul.
          </p>
          <div className="auth-features">
            <div className="feature-card">
              <div className="feature-icon">🔥</div>
              <div>
                <p className="feature-title">Track your streaks</p>
                <p className="feature-desc">Build a lasting habit with gentle daily reminders.</p>
              </div>
            </div>
            <div className="auth-features-row">
              <div className="feature-card">
                <div>
                  <div className="feature-icon">😊</div>
                  <p className="feature-title">Discover verses by mood</p>
                  <p className="feature-desc">Personalized scripture for every season.</p>
                </div>
              </div>
              <div className="feature-card">
                <div>
                  <div className="feature-icon">🎵</div>
                  <p className="feature-title">Sync your music</p>
                  <p className="feature-desc">The ultimate sanctuary for your ears.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="auth-footer-left">THE SUNSET SANCTUARY © 2024</p>
      </div>

      {/* ── RIGHT ── */}
      <div className="auth-right">
        <div className="auth-form-container">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Begin your journey in the golden hour.</p>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <input
                className="auth-input"
                type="text"
                placeholder="Elizabeth Bennet"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input
                className="auth-input"
                type="email"
                placeholder="hello@sanctuary.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  className="auth-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="auth-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn">
              Create Account →
            </button>
          </form>

          <div className="auth-divider"><span>OR JOIN WITH</span></div>

          <div className="auth-social">
            <button className="social-btn">
              <span className="social-logo">G</span> Google
            </button>
            <button className="social-btn">
              <span className="social-logo">iOS</span> Apple
            </button>
          </div>

          <p className="auth-switch">
            Already a member? <Link to="/login" className="auth-link">Sign In</Link>
          </p>
        </div>

        <div className="auth-footer-right">
          <span>PRIVACY</span>
          <span>TERMS</span>
          <span>SUPPORT</span>
        </div>
      </div>

    </div>
  )
}

export default Signup