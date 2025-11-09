import { memo, useCallback, useMemo } from 'react';
import type { Language, MainContentTab } from '../types';
import { UI_TEXT } from '../translations';

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
} as const satisfies Partial<Record<MainContentTab, TranslationKey>>;

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

const translateTab = (tab: string, texts: Record<TranslationKey, string>) => {
    const translationKey = TAB_TRANSLATION_KEYS[tab as keyof typeof TAB_TRANSLATION_KEYS];
    return translationKey ? texts[translationKey] : tab;
};

const createTabLabelMap = <T extends string>(tabs: readonly T[], texts: Record<TranslationKey, string>) =>
    tabs.reduce<Record<T, string>>((acc, tab) => {
        acc[tab] = translateTab(tab, texts);
        return acc;
    }, {} as Record<T, string>);

const useTabLabels = <T extends string>(tabs: readonly T[], language: Language) => {
    const texts = useMemo(() => UI_TEXT[language], [language]);
    return useMemo(() => createTabLabelMap(tabs, texts), [tabs, texts]);
};

const TopNavBar = memo(function TopNavBar<T extends string>({ tabs, activeTab, onTabChange, language }: TopNavBarProps<T>) {
    const tabLabels = useTabLabels(tabs, language);

    const getTabClasses = useCallback(
        (tab: T) => (activeTab === tab ? ACTIVE_TAB_CLASSNAME : INACTIVE_TAB_CLASSNAME),
        [activeTab]
    );

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
});

TopNavBar.displayName = 'TopNavBar';

export default TopNavBar;
