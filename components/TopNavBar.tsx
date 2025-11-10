import type { Language } from '../types.ts';
import { UI_TEXT } from '../translations.ts';

interface TopNavBarProps<T extends string> {
    tabs: T[];
    activeTab: T;
    onTabChange: (tab: T) => void;
    language: Language;
}

const tabTranslationKeys: { [key: string]: keyof (typeof UI_TEXT)['en'] } = {
    'Posts': 'posts',
    'Reels': 'reels',
    'Candidates': 'candidates',
    'Women Candidates': 'womenCandidates',
    'Debates': 'debates',
    'Tea House': 'teaHouse',
    'Events': 'events',
    'Articles': 'articles',
    'Ask Neighbor': 'askNeighbor',
    'IHEC Updates': 'ihecUpdates',
};


function TopNavBar<T extends string>({ tabs, activeTab, onTabChange, language }: TopNavBarProps<T>) {
    const texts = UI_TEXT[language];
    const navBarClasses = 'border-b border-[var(--color-glass-border)]';

    const getTabClasses = (tab: T) => {
        const isActive = activeTab === tab;
        return isActive
            ? 'border-primary text-primary glow'
            : 'border-transparent text-theme-text-muted hover:text-theme-text-base hover:border-theme-text-muted';
    };

    return (
        <div className={navBarClasses}>
            <nav className="-mb-px flex justify-center space-x-6 px-4 sm:px-6 overflow-x-auto no-scrollbar" aria-label="Tabs">
                {tabs.map((tab) => {
                    const translationKey = tabTranslationKeys[tab];
                    const label = translationKey ? texts[translationKey] : tab;

                    return (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors font-arabic ${getTabClasses(tab)}`}
                        >
                            {label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default TopNavBar;