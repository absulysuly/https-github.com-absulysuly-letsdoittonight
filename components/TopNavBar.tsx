import { memo, useMemo } from 'react';
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

function TopNavBarComponent<T extends string>({ tabs, activeTab, onTabChange, language }: TopNavBarProps<T>) {
    const texts = useMemo<LanguageTexts>(() => UI_TEXT[language], [language]);
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
                    const translationKey = TAB_TRANSLATION_KEYS[tab];
                    const label: string = translationKey ? texts[translationKey] : tab;

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
}

export const TopNavBar = memo(TopNavBarComponent) as typeof TopNavBarComponent;
