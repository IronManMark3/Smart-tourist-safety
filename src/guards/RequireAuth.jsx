import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export default function RequireAuth({ children, allow = ['tourist', 'authority'] }) {
  const user = useAuthStore(s => s.currentUser)
  const loc = useLocation()
  if (!user || !allow.includes(user.role)) {
    return <Navigate to="/auth/login" replace state={{ from: loc.pathname }} />
  }
  return children
}
