import { Link, useLocation } from 'react-router-dom'
import { UI_TEXT } from '../translations'
import type { Language } from '../types'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ language }: { language: Language }) {
  const text = UI_TEXT[language]
  const { isStudent } = useAuth()
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: text.home },
    ...(isStudent ? [{ to: '/campus', label: text.campus }] : []),
    { to: '/profile', label: text.profile },
  ]

  return (
    <aside className="fixed top-14 left-0 z-30 w-64 h-full -translate-x-full lg:translate-x-0 border-r border-white/10 p-4">
      <nav className="space-y-2">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className={`block rounded p-2 ${pathname === link.to ? 'bg-primary/20 text-primary' : ''}`}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
