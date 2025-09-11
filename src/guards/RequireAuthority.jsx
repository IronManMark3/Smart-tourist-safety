import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export default function RequireAuthority({ children }) {
  const user = useAuthStore(s => s.currentUser)
  const loc = useLocation()
  if (!user || user.role !== 'authority') {
    return <Navigate to="/auth/login" replace state={{ from: loc.pathname }} />
  }
  return children
}
