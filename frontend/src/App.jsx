import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BibleProvider } from './context/BibleContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import BibleReader from './pages/BibleReader'
import Journal from './pages/Journal'
import Favorites from './pages/Favorites'
import DailyVerse from './pages/DailyVerse'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

const ComingSoon = ({ page }) => (
  <div style={{ minHeight: '100vh', background: '#0d0b09', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.5rem', color: 'rgba(200,185,165,0.4)' }}>
      {page} — coming soon
    </p>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <BibleProvider>
        <Routes>
          <Route path="/login"     element={<Login />} />
          <Route path="/signup"    element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/bible"     element={<ProtectedRoute><BibleReader /></ProtectedRoute>} />
          <Route path="/library"   element={<ProtectedRoute><ComingSoon page="Library" /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><ComingSoon page="Community" /></ProtectedRoute>} />

    
<Route path="/journal"    element={<ProtectedRoute><Journal /></ProtectedRoute>} />

<Route path="/favorites"   element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
<Route path="/daily-verse" element={<ProtectedRoute><DailyVerse /></ProtectedRoute>} />
        </Routes>
      </BibleProvider>
    </AuthProvider>
  )
}

export default App