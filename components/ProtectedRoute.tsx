import { useEffect, useState, type ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: ReactElement
  requireStudent?: boolean
}

export default function ProtectedRoute({ children, requireStudent = false }: ProtectedRouteProps) {
  const { isAuthenticated, loading, isStudent } = useAuth()
  const location = useLocation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || loading) return <div className="p-4">Loading...</div>
  if (!isAuthenticated) return <Navigate to="/" replace state={{ from: location }} />
  if (requireStudent && !isStudent) return <Navigate to="/" replace />

  return <>{children}</>
}
