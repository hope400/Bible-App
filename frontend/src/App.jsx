import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BibleProvider } from './context/BibleContext'
import Login       from './pages/Login'
import Signup      from './pages/Signup'
import Dashboard   from './pages/Dashboard'
import BibleReader from './pages/BibleReader'
import Journal     from './pages/Journal'
import Favorites   from './pages/Favorites'
import DailyVerse  from './pages/DailyVerse'
import Library     from './pages/Library'
import Community   from './pages/Community'
import Settings    from './pages/Settings'
import { useReminder } from './useReminder'
import './GlobalThemes.css'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function applyTheme(themeId) {
  document.documentElement.classList.remove('theme-sunset', 'theme-forest', 'theme-ocean')
  document.documentElement.classList.add(`theme-${themeId}`)
}


function AppInner() {
 
  useEffect(() => {
    const saved = localStorage.getItem('bibble-theme') || 'sunset'
    applyTheme(saved)
  }, [])

 
  useReminder()

  return (
    <Routes>
      <Route path="/login"       element={<Login />} />
      <Route path="/signup"      element={<Signup />} />
      <Route path="/"            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/bible"       element={<ProtectedRoute><BibleReader /></ProtectedRoute>} />
      <Route path="/library"     element={<ProtectedRoute><Library /></ProtectedRoute>} />
      <Route path="/journal"     element={<ProtectedRoute><Journal /></ProtectedRoute>} />
      <Route path="/community"   element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/favorites"   element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/daily-verse" element={<ProtectedRoute><DailyVerse /></ProtectedRoute>} />
      <Route path="/settings"    element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BibleProvider>
        <AppInner />
      </BibleProvider>
    </AuthProvider>
  )
}

export default App