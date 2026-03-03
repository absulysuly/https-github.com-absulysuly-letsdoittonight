import { useMemo, useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import BottomBar from './components/BottomBar'
import LoginModal from './components/LoginModal'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppRouter from './router/AppRouter'
import { AppTab, UserRole, type HomeViewMode, type Language, type User } from './types'

function AppShell() {
  const [language, setLanguage] = useState<Language>('en')
  const [homeViewMode] = useState<HomeViewMode>('Social')
  const [isLoginModalOpen, setLoginModalOpen] = useState(false)
  const { user, login, signup, logout } = useAuth()

  const uiUser = useMemo<User | null>(() => {
    if (!user) return null
    return {
      id: user.id,
      name: user.name || user.email,
      email: user.email,
      role: UserRole.Voter,
      avatarUrl: user.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`,
      verified: true,
      party: 'Independent',
      governorate: 'Baghdad',
      stories: [],
    }
  }, [user])

  const handleNavigate = (tab: AppTab | string) => {
    const routeMap: Record<string, string> = {
      [AppTab.Home]: '/',
      [AppTab.Discover]: '/feed',
      [AppTab.Candidates]: '/candidates',
      [AppTab.DebateRoom]: '/debates',
      [AppTab.UserProfile]: '/',
      [AppTab.TeaHouse]: '/',
      [AppTab.Settings]: '/',
      [AppTab.GeminiTools]: '/',
      [AppTab.AIStudioEmbed]: '/',
    }
    const path = routeMap[String(tab)] || String(tab) || '/'
    window.location.assign(path)
  }

  return (
    <div className="min-h-screen font-sans">
      <Header user={uiUser} onRequestLogin={() => setLoginModalOpen(true)} onNavigate={(tab) => handleNavigate(tab)} language={language} />
      <Sidebar user={uiUser} activeTab={AppTab.Home} onNavigate={(tab) => handleNavigate(tab)} homeViewMode={homeViewMode} language={language} />
      <main className="lg:pl-64 pt-14 pb-16 lg:pb-0">
        <AppRouter />
      </main>
      <BottomBar
        user={uiUser}
        homeViewMode={homeViewMode}
        socialActiveTab={AppTab.Home}
        onSocialNavigate={(tab) => handleNavigate(tab)}
        electionActivePath="/"
        onElectionNavigate={(path) => handleNavigate(path)}
        language={language}
      />

      {isLoginModalOpen && (
        <LoginModal
          onLogin={() => undefined}
          onClose={() => setLoginModalOpen(false)}
          language={language}
          onLanguageChange={setLanguage}
          authLogin={login}
          authSignup={signup}
          authLogout={logout}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
