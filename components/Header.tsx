import { useNavigate } from 'react-router-dom'
import { UI_TEXT } from '../translations'
import type { Language } from '../types'

export default function Header({ language }: { language: Language }) {
  const navigate = useNavigate()
  const text = UI_TEXT[language]

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center px-4 glass-nav">
      <button className="text-xl font-bold" onClick={() => navigate('/')}>{text.appName}</button>
    </header>
  )
}
