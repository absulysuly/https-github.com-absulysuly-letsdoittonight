import { memo, useCallback, useMemo } from 'react';
import type { Language } from '../types.ts';
import { UI_TEXT } from '../translations.ts';

type TranslationKey = keyof (typeof UI_TEXT)['en'];

const TAB_TRANSLATION_KEYS = {
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
} as const satisfies Record<string, TranslationKey>;

export interface TopNavBarProps<T extends string> {
    tabs: readonly T[];
    activeTab: T;
    onTabChange: (tab: T) => void;
    language: Language;
}

const NAV_BAR_CLASSNAME = 'border-b border-[var(--color-glass-border)]';
const TAB_BASE_CLASSNAME =
    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors font-arabic';
const ACTIVE_TAB_CLASSNAME = `${TAB_BASE_CLASSNAME} border-primary text-primary glow`;
const INACTIVE_TAB_CLASSNAME =
    `${TAB_BASE_CLASSNAME} border-transparent text-theme-text-muted hover:text-theme-text-base hover:border-theme-text-muted`;

const TopNavBarComponent = <T extends string>({ tabs, activeTab, onTabChange, language }: TopNavBarProps<T>) => {
    const texts = UI_TEXT[language];

    const tabLabels = useMemo(() => {
        const translationLookup = TAB_TRANSLATION_KEYS as Record<string, TranslationKey | undefined>;

        return tabs.reduce<Record<T, string>>((acc, tab) => {
            const translationKey = translationLookup[tab as string];
            acc[tab] = translationKey ? texts[translationKey] : tab;
            return acc;
        }, {} as Record<T, string>);
    }, [tabs, texts]);

    const getTabClasses = useCallback((tab: T) => (activeTab === tab ? ACTIVE_TAB_CLASSNAME : INACTIVE_TAB_CLASSNAME), [activeTab]);

    const createTabHandler = useCallback(
        (tab: T) => () => {
            onTabChange(tab);
        },
        [onTabChange]
    );

    return (
        <div className={NAV_BAR_CLASSNAME}>
            <nav className="-mb-px flex justify-center space-x-6 px-4 sm:px-6 overflow-x-auto no-scrollbar" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button key={tab} onClick={createTabHandler(tab)} className={getTabClasses(tab)}>
                        {tabLabels[tab] ?? tab}
                    </button>
                ))}
            </nav>
        </div>
    );
};

const TopNavBar = memo(TopNavBarComponent) as typeof TopNavBarComponent;

export type { TopNavBarProps };
export default TopNavBar;
