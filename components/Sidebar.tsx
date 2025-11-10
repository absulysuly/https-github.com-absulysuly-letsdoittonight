import React from 'react';
import { AppTab, UserRole, User, HomeViewMode, Language } from '../types.ts';
import { DashboardIcon, SettingsIcon, DebateIcon, TeaHouseIcon, UsersIcon, ChartIcon, HomeIcon, ScaleIcon, LifebuoyIcon, IdentificationIcon, SparklesIcon, DatabaseIcon } from './icons/Icons.tsx';
import { UI_TEXT } from '../translations.ts';

interface SidebarProps {
    user: User | null;
    activeTab: AppTab | string;
    onNavigate: (tab: AppTab | string) => void;
    homeViewMode: HomeViewMode;
    language: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, onNavigate, homeViewMode, language }) => {
    const texts = UI_TEXT[language];

    const socialNavItems = [
        { label: texts.home, icon: HomeIcon, tab: AppTab.Home, enabled: true },
        { label: texts.teaHouse, icon: TeaHouseIcon, tab: AppTab.TeaHouse, enabled: true },
        { label: texts.debates, icon: DebateIcon, tab: AppTab.DebateRoom, enabled: true },
        { label: texts.geminiTools, icon: SparklesIcon, tab: AppTab.GeminiTools, enabled: true },
        { label: 'AI Studio', icon: SparklesIcon, tab: AppTab.AIStudioEmbed, enabled: true },
        { label: texts.dashboard, icon: DashboardIcon, tab: AppTab.Dashboard, enabled: user?.role === UserRole.Candidate },
        { label: texts.myProfile, icon: UsersIcon, tab: AppTab.UserProfile, enabled: user != null },
        { label: texts.settings, icon: SettingsIcon, tab: AppTab.Settings, enabled: true },
    ];

    const electionNavItems = [
        { label: 'Dashboard', icon: DashboardIcon, path: '/dashboard', enabled: true },
        { label: 'Voter Center', icon: IdentificationIcon, path: '/voter-registration', enabled: true },
        { label: 'Integrity Hub', icon: ScaleIcon, path: '/integrity-hub', enabled: true },
        { label: 'Data & Analytics', icon: ChartIcon, path: '/compare', enabled: true },
        { label: 'Data Viz', icon: ChartIcon, path: '/data-viz', enabled: true },
        { label: 'Raw Data', icon: DatabaseIcon, path: '/raw-data', enabled: true },
        { label: 'Agent Processor', icon: SparklesIcon, path: '/agent-data-processor', enabled: true },
        { label: 'Resources', icon: LifebuoyIcon, path: '/terms-of-service', enabled: true },
    ];

    const getLinkClasses = (tab: AppTab | string) => {
        return activeTab === tab ? 'bg-primary/20 text-primary' : 'text-theme-text-muted hover:bg-primary/10 hover:text-theme-text-base';
    };

    const getIconClasses = (tab: AppTab | string) => {
        return activeTab === tab ? 'text-primary' : 'text-theme-text-muted group-hover:text-theme-text-base';
    };

    const renderNavList = (items: { label: string; icon: React.FC<any>; tab?: AppTab; path?: string; enabled: boolean }[]) => (
        <ul className="space-y-2 font-medium">
            {items.map(item => item.enabled && (
                <li key={item.label}>
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onNavigate(item.tab || item.path || '/'); }}
                        className={`flex items-center p-2 rounded-lg group ${getLinkClasses(item.tab || item.path || '/')}`}
                    >
                        <item.icon className={`w-6 h-6 transition duration-75 ${getIconClasses(item.tab || item.path || '/')}`} />
                        <span className="ml-3">{item.label}</span>
                    </a>
                </li>
            ))}
        </ul>
    );


    return (
        <aside className="fixed top-0 left-0 z-30 w-64 h-full transition-transform -translate-x-full lg:translate-x-0 pt-14" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-[var(--color-glass-bg)] backdrop-blur-[20px] border-r border-[var(--color-glass-border)]">
                {homeViewMode === 'Social' ? (
                    <>
                        <h3 className="px-2 pb-2 text-sm font-semibold text-theme-text-muted uppercase tracking-wider">{texts.social}</h3>
                        {renderNavList(socialNavItems)}
                    </>
                ) : (
                    <>
                        <h3 className="px-2 pb-2 text-sm font-semibold text-theme-text-muted uppercase tracking-wider">{texts.electionPortal}</h3>
                        {renderNavList(electionNavItems)}
                    </>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;