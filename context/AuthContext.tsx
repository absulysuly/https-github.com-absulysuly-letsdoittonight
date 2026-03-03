import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../services/supabaseClient'

interface User {
  id: string
  email: string
  name?: string
  role?: string
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email!,
          name: data.session.user.user_metadata?.name,
        })
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.name,
      } : null)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    if (!supabase) { setUser({ id: 'mock', email }); return }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signup = async (email: string, password: string, name: string) => {
    if (!supabase) { setUser({ id: 'mock', email, name }); return }
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } }
    })
    if (error) throw error
  }

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
