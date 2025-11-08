import React from 'react';
import { AppTab, User, Language, HomeViewMode } from '../types.ts';
import { HomeIcon, TeaHouseIcon, DebateIcon, UserCircleIcon, DashboardIcon, UsersIcon, ChartIcon, LifebuoyIcon } from './icons/Icons.tsx';
import { UI_TEXT } from '../translations.ts';

interface BottomBarProps {
    user: User | null;
    homeViewMode: HomeViewMode;
    socialActiveTab: AppTab;
    onSocialNavigate: (tab: AppTab) => void;
    electionActivePath: string;
    onElectionNavigate: (path: string) => void;
    language: Language;
}

const BottomBar: React.FC<BottomBarProps> = ({ 
    user, 
    homeViewMode, 
    socialActiveTab, 
    onSocialNavigate, 
    electionActivePath, 
    onElectionNavigate, 
    language 
}) => {
    const texts = UI_TEXT[language];
    const barClasses = 'bg-[var(--color-glass-bg)] backdrop-blur-lg border-t border-[var(--color-glass-border)]';

    const socialNavItems = [
        { label: texts.home, icon: HomeIcon, tab: AppTab.Home, enabled: true },
        { label: texts.teaHouse, icon: TeaHouseIcon, tab: AppTab.TeaHouse, enabled: true },
        { label: texts.debates, icon: DebateIcon, tab: AppTab.DebateRoom, enabled: true },
        { label: texts.myProfile, icon: UserCircleIcon, tab: AppTab.UserProfile, enabled: user != null },
    ];
    
    const electionNavItems = [
        { label: texts.portal, icon: DashboardIcon, path: '/', enabled: true },
        { label: texts.electionCandidates, icon: UsersIcon, path: '/parties', enabled: true },
        { label: texts.electionData, icon: ChartIcon, path: '/compare', enabled: true },
        { label: texts.resources, icon: LifebuoyIcon, path: '/integrity-hub', enabled: true },
    ];

    if (homeViewMode === 'Election') {
        return (
            <div className={`fixed bottom-0 left-0 right-0 z-50 h-16 lg:hidden ${barClasses}`}>
                <div className="grid grid-cols-4 h-full max-w-lg mx-auto font-medium">
                    {electionNavItems.map(item => (item.enabled) && (
                        <button
                            key={item.label}
                            onClick={() => onElectionNavigate(item.path)}
                            type="button"
                            className={`inline-flex flex-col items-center justify-center px-2 group hover:bg-primary/10 ${electionActivePath === item.path ? 'text-primary' : 'text-theme-text-muted'}`}
                        >
                            <item.icon className="w-6 h-6 mb-1" />
                            <span className="text-[10px] leading-tight text-center font-arabic">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-50 h-16 lg:hidden ${barClasses}`}>
            <div className="grid grid-cols-4 h-full max-w-lg mx-auto font-medium">
                {socialNavItems.map(item => (item.enabled) && (
                    <button
                        key={item.label}
                        onClick={() => onSocialNavigate(item.tab)}
                        type="button"
                        className={`inline-flex flex-col items-center justify-center px-2 group hover:bg-primary/10 ${socialActiveTab === item.tab ? 'text-primary' : 'text-theme-text-muted'}`}
                    >
                        <item.icon className="w-6 h-6 mb-1" />
                        <span className="text-[10px] leading-tight text-center font-arabic">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BottomBar;