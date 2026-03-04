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
  // Keep built-in tab labels centralized so localizations stay consistent
  const labels: Partial<Record<T, string>> = {
    General: text.home,
    Campus: text.campus,
    Community: text.community,
  } as Partial<Record<T, string>>

  return (
    <div className="border-b border-white/10">
      <nav className="-mb-px flex justify-center gap-4 overflow-x-auto px-4 sm:gap-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            aria-current={activeTab === tab ? 'page' : undefined}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-theme-bg ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-theme-text-muted hover:text-theme-text-base'
            }`}
          >
            {labels[tab] || tab}
          </button>
        ))}
      </nav>
    </div>
  )
}
