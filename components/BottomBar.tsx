import { Link, useLocation } from 'react-router-dom'
import { UI_TEXT } from '../translations'
import type { Language } from '../types'

export default function BottomBar({ language }: { language: Language }) {
  const { pathname } = useLocation()
  const text = UI_TEXT[language]

  const links = [
    { to: '/', label: text.home },
    { to: '/students', label: text.students },
    { to: '/profile', label: text.profile },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-14 border-t border-white/10 bg-black/40 backdrop-blur lg:hidden">
      <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${links.length}, minmax(0,1fr))` }}>
        {links.map((link) => (
          <Link key={link.to} to={link.to} className={`flex items-center justify-center text-sm ${pathname === link.to ? 'text-primary' : 'text-theme-text-muted'}`}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
