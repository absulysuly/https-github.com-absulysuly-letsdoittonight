import { BrowserRouter } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import BottomBar from './components/BottomBar'
import { AuthProvider } from './context/AuthContext'
import AppRouter from './router/AppRouter'
import { useState } from 'react'
import type { Language } from './types'

function AppShell() {
  const [language] = useState<Language>('en')

  return (
    <div className="min-h-screen font-sans">
      <Header language={language} />
      <Sidebar language={language} />
      <main className="lg:pl-64 pt-16 pb-16 lg:pb-0">
        <AppRouter language={language} />
      </main>
      <BottomBar language={language} />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  )
}
