import { useRef, type KeyboardEvent } from 'react'
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
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  // Keep built-in tab labels centralized so localizations stay consistent
  const labels: Partial<Record<T, string>> = {
    General: text.home,
    Campus: text.campus,
    Community: text.community,
  } as Partial<Record<T, string>>

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return
    }

    event.preventDefault()
    const direction = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (index + direction + tabs.length) % tabs.length
    const nextTab = tabs[nextIndex]
    onTabChange(nextTab)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="border-b border-white/10">
      <nav className="-mb-px flex justify-center gap-4 overflow-x-auto px-4 sm:gap-6" aria-label="Tabs" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            ref={(element) => {
              tabRefs.current[index] = element
            }}
            type="button"
            onClick={() => onTabChange(tab)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            role="tab"
            aria-selected={activeTab === tab}
            tabIndex={activeTab === tab ? 0 : -1}
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
