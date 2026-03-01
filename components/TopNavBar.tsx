import { UI_TEXT } from '../translations.ts';
import { Language } from '../types.ts';

interface TopNavBarProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  language: Language;
}

const tabTranslationKeys: Partial<Record<string, keyof (typeof UI_TEXT)['en']>> = {
  Posts: 'posts',
  Reels: 'reels',
  Candidates: 'candidates',
  'Women Candidates': 'womenCandidates',
  Debates: 'debates',
  'Tea House': 'teaHouse',
  Events: 'events',
  Articles: 'articles',
  'Ask Neighbor': 'askNeighbor',
  'IHEC Updates': 'ihecUpdates',
};

export default function TopNavBar<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  language,
}: TopNavBarProps<T>) {
  const texts = UI_TEXT[language];

  const getTabClasses = (tab: T) => {
    const isActive = activeTab === tab;
    return isActive
      ? 'border-primary text-primary glow'
      : 'border-transparent text-theme-text-muted hover:text-theme-text-base hover:border-theme-text-muted';
  };

  return (
    <div className="border-b border-[var(--color-glass-border)]">
      <nav
        className="-mb-px flex justify-center space-x-6 overflow-x-auto px-4 no-scrollbar sm:px-6"
        aria-label="Tabs"
      >
        {tabs.map((tab) => {
          const translationKey = tabTranslationKeys[tab];
          const label = translationKey ? texts[translationKey] : tab;

          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium font-arabic transition-colors ${getTabClasses(tab)}`}
            >
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
