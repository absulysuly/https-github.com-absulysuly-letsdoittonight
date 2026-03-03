import { UI_TEXT } from '../translations'
import type { Language } from '../types'

interface TopNavBarProps<T extends string> {
  tabs: T[]
  activeTab: T
  onTabChange: (tab: T) => void
  language: Language
}

export default function TopNavBar<T extends string>({ tabs, activeTab, onTabChange, language }: TopNavBarProps<T>) {
  const text = UI_TEXT[language]
  const labels: Record<string, string> = {
    General: text.home,
    Campus: text.campus,
    Community: text.community,
  }

  return (
    <div className="border-b border-white/10">
      <nav className="-mb-px flex justify-center space-x-6 overflow-x-auto px-4" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-theme-text-muted'}`}
          >
            {labels[tab] || tab}
          </button>
        ))}
      </nav>
    </div>
  )
}
