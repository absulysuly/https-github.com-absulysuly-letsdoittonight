import { Link, useLocation } from 'react-router-dom'
import { UI_TEXT } from '../translations'
import type { Language } from '../types'

export default function Sidebar({ language }: { language: Language }) {
  const text = UI_TEXT[language]
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: text.home },
    { to: '/students', label: text.students },
    { to: '/profile', label: text.profile },
  ]

  return (
    <aside className="fixed top-14 left-0 z-30 h-full w-64 -translate-x-full border-r border-white/10 p-4 lg:translate-x-0">
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
