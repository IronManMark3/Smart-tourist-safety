import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Landing from './pages/Landing.jsx'
import Tourist from './pages/Tourist.jsx'
import AuthorityDashboard from './pages/AuthorityDashboard.jsx'
import Alerts from './pages/Alerts.jsx'
import EFIR from './pages/EFIR.jsx'
import AuthLogin from './pages/AuthLogin.jsx'
import AuthSignup from './pages/AuthSignup.jsx'
import TouristOnboarding from './pages/TouristOnboarding.jsx'
import RequireAuth from './guards/RequireAuth.jsx'
import RequireAuthority from './guards/RequireAuthority.jsx'
import ActiveTourists from './pages/ActiveTourists.jsx'
import { useAuthStore } from './store/useAuthStore'
import { useAppStore } from './store/useAppStore'

export default function App() {
  const auth = useAuthStore(s => s.currentUser)
  const setCurrentUserId = useAppStore(s => s.setCurrentUserId)
  const upsertActiveTourist = useAppStore(s => s.upsertActiveTourist)
  const safetyScore = useAppStore(s => s.tourist.safetyScore)
  const location = useAppStore(s => s.tourist.location)

  useEffect(() => {
    // On load or when auth changes, reflect tourist in activeTourists
    if (auth && auth.role === 'tourist') {
      setCurrentUserId(auth.id)
      upsertActiveTourist({
        id: auth.id,
        name: (auth.profile?.name || auth.name || auth.email),
        score: safetyScore,
        location,
      })
    } else {
      setCurrentUserId(null)
    }
  }, [auth, setCurrentUserId, upsertActiveTourist, safetyScore, location])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/login" element={<AuthLogin />} />
          <Route path="/auth/signup" element={<AuthSignup />} />
          <Route path="/tourist/onboarding" element={
            <RequireAuth allow={['tourist']}>
              <TouristOnboarding />
            </RequireAuth>
          } />
          <Route path="/tourist" element={
            <RequireAuth allow={['tourist']}>
              <Tourist />
            </RequireAuth>
          } />
          <Route path="/authority" element={
            <RequireAuthority>
              <AuthorityDashboard />
            </RequireAuthority>
          } />
          <Route path="/authority/tourists" element={
            <RequireAuthority>
              <ActiveTourists />
            </RequireAuthority>
          } />
          <Route path="/authority/alerts" element={
            <RequireAuthority>
              <Alerts />
            </RequireAuthority>
          } />
          <Route path="/authority/e-fir" element={
            <RequireAuthority>
              <EFIR />
            </RequireAuthority>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </div>
  )
}
