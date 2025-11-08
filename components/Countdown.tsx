import React from 'react';
import { useCountdown } from './election/hooks/useCountdown.ts';
import { ClockIcon } from './icons/Icons.tsx';
import { Language } from '../types.ts';
import { UI_TEXT } from '../translations.ts';

interface CountdownProps {
    language: Language;
}

const Countdown: React.FC<CountdownProps> = ({ language }) => {
    const electionDateString = process.env.ELECTION_DATE || '2025-11-11T08:00:00';
    const electionDate = new Date(electionDateString);
    const [days, hours, minutes, seconds] = useCountdown(electionDate);
    const texts = UI_TEXT[language];

    if (days < 0) { // If date has passed
        return null;
    }
    
    const items = [
        { label: texts.days, value: days },
        { label: texts.hours, value: hours },
        { label: texts.minutes, value: minutes },
        { label: texts.seconds, value: seconds },
    ];

    return (
        <div className="glass-card rounded-full p-2 w-full max-w-lg mx-auto">
            <div className="flex items-center justify-between text-center px-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-primary font-bold">
                    <ClockIcon className="w-5 h-5"/>
                    <span className="text-sm font-arabic">{texts.electionCountdownTitle}</span>
                </div>
                <div className="flex items-baseline space-x-3 rtl:space-x-reverse text-theme-text-base" dir="ltr">
                    {items.map(item => (
                        <div key={item.label} className="flex items-baseline">
                            <span className="text-lg font-bold w-8 text-center">{String(item.value).padStart(2, '0')}</span>
                            <span className="text-[10px] ml-0.5 rtl:ml-0 rtl:mr-0.5 opacity-80">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Countdown;
