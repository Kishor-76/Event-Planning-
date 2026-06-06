import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'

export function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
