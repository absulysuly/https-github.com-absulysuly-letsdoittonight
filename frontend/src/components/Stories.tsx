import React from 'react';
import { User } from '../types.ts';
import { PlusIcon } from './icons/Icons.tsx';

interface StoriesProps {
    users: User[];
    onSelectStory: (profile: User) => void;
    currentUser: User | null;
    onAddStory: () => void;
}

const StoryItem: React.FC<{ user: User; onSelectStory: (profile: User) => void; }> = ({ user, onSelectStory }) => (
    <button
        onClick={() => onSelectStory(user)}
        className="flex flex-col items-center flex-shrink-0 w-24 p-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
        aria-label={`View stories by ${user.name}`}
    >
        <div className="relative">
            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-secondary via-primary to-accent">
                 <img 
                    loading="lazy"
                    className="w-full h-full rounded-full object-cover border-2 border-[var(--color-background)]"
                    src={user.avatarUrl} 
                    alt={user.name} 
                 />
            </div>
        </div>
        <p className="text-xs text-center text-theme-text-muted group-hover:text-theme-text-base truncate w-full mt-2">{user.name}</p>
    </button>
);

const AddStoryItem: React.FC<{ user: User; onAddStory: () => void; }> = ({ user, onAddStory }) => (
     <button
        onClick={onAddStory}
        className="flex flex-col items-center flex-shrink-0 w-24 p-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
        aria-label="Add to your story"
    >
        <div className="relative">
            <div className="w-16 h-16 rounded-full p-0.5 bg-white/20">
                 <img 
                    className="w-full h-full rounded-full object-cover border-2 border-[var(--color-background)]"
                    src={user.avatarUrl} 
                    alt={user.name} 
                 />
                 <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-[var(--color-background)]">
                    <PlusIcon className="w-4 h-4 text-on-primary"/>
                 </div>
            </div>
        </div>
        <p className="text-xs text-center text-theme-text-base truncate w-full mt-2">Add Story</p>
    </button>
);


const Stories: React.FC<StoriesProps> = ({ users, onSelectStory, currentUser, onAddStory }) => {
    if (!users || users.length === 0) {
        return null;
    }
    
    // Filter out current user from the main list if they are present
    const otherUsers = currentUser ? users.filter(u => u.id !== currentUser.id) : users;

    // Duplicate users for a seamless loop.
    const extendedUsers = [...otherUsers, ...otherUsers];

    return (
        <div className="w-full overflow-hidden relative">
            <div 
                className="flex"
            >
                {currentUser && <AddStoryItem user={currentUser} onAddStory={onAddStory} />}
                <div 
                    className="flex"
                    style={{ animation: `scroll-x ${otherUsers.length * 1.5}s linear infinite` }}
                >
                    {extendedUsers.map((user, index) => (
                        <StoryItem key={`${user.id}-${index}`} user={user} onSelectStory={onSelectStory} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Stories;