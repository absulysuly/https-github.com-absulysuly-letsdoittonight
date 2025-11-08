import { memo, useCallback, useMemo } from 'react';

import type { Language } from '../types.ts';
import { UI_TEXT } from '../translations.ts';

type LanguageTexts = (typeof UI_TEXT)[Language];
type StringTranslationKey = {
    [K in keyof LanguageTexts]: LanguageTexts[K] extends string ? K : never;
}[keyof LanguageTexts];

export interface TopNavBarProps<T extends string> {
    tabs: T[];
    activeTab: T;
    onTabChange: (tab: T) => void;
    language: Language;
}

const TAB_TRANSLATION_KEYS: Partial<Record<string, StringTranslationKey>> = {
    Posts: 'posts',
    Reels: 'reels',
    Candidates: 'candidates',
    'Women Candidates': 'womenCandidates',
    Debates: 'debates',
    'Tea House': 'teaHouse',
    Events: 'events',
    Articles: 'articles',
    'Ask Neighbor': 'askNeighbor',
} as const;

const NAV_BAR_BASE_CLASS = 'border-b border-[var(--color-glass-border)]';
const TAB_CONTAINER_CLASS =
    '-mb-px flex justify-center space-x-6 px-4 sm:px-6 overflow-x-auto no-scrollbar';
const ACTIVE_TAB_CLASS = 'border-primary text-primary glow';
const INACTIVE_TAB_CLASS =
    'border-transparent text-theme-text-muted hover:text-theme-text-base hover:border-theme-text-muted';

function TopNavBarComponent<T extends string>({ tabs, activeTab, onTabChange, language }: TopNavBarProps<T>) {
    const texts = useMemo<LanguageTexts>(() => UI_TEXT[language], [language]);

    const getTabClasses = (tab: T) => (activeTab === tab ? ACTIVE_TAB_CLASS : INACTIVE_TAB_CLASS);

    const handleTabClick = useCallback((tab: T) => () => onTabChange(tab), [onTabChange]);

    const getTabLabel = (tab: T) => {
        const translationKey = TAB_TRANSLATION_KEYS[tab];
        return translationKey ? texts[translationKey] : tab;
    };

    return (
        <div className={NAV_BAR_BASE_CLASS}>
            <nav className={TAB_CONTAINER_CLASS} aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={handleTabClick(tab)}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors font-arabic ${getTabClasses(tab)}`}
                    >
                        {getTabLabel(tab)}
                    </button>
                ))}
            </nav>
        </div>
    );
}

const MemoizedTopNavBar = memo(TopNavBarComponent);
MemoizedTopNavBar.displayName = 'TopNavBar';

export const TopNavBar = MemoizedTopNavBar as typeof TopNavBarComponent;
