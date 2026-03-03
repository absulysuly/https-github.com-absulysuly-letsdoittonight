import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../services/supabaseClient'
import { profileService } from '../services/profileService'
import type { Profile, UserRole } from '../types'

interface AuthContextType {
  profile: Profile | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  isStudent: boolean
  role: UserRole
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const hydrateProfile = async (userId: string, email?: string, full_name?: string) => {
    const p = await profileService.getProfile(userId)
    setProfile(p || { id: userId, email, full_name, role: 'general' })
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(async ({ data }) => {
      const sessionUser = data.session?.user
      if (sessionUser) {
        await hydrateProfile(sessionUser.id, sessionUser.email, sessionUser.user_metadata?.name)
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user
      if (sessionUser) {
        await hydrateProfile(sessionUser.id, sessionUser.email, sessionUser.user_metadata?.name)
      } else {
        setProfile(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    if (!supabase) {
      setProfile({ id: 'mock-user', email, full_name: 'Mock User', role: 'student' })
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signup = async (email: string, password: string, name: string) => {
    if (!supabase) {
      setProfile({ id: 'mock-user', email, full_name: name, role: 'general' })
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error
  }

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    setProfile(null)
  }

  const role: UserRole = profile?.role || 'general'

  return (
    <AuthContext.Provider
      value={{
        profile,
        isAuthenticated: !!profile,
        loading,
        login,
        signup,
        logout,
        isStudent: role === 'student',
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
