import React, { useState } from 'react';
import { User } from '../../../types.ts';
import { VideoIcon } from '../../icons/Icons.tsx';

interface ReelComposerProps {
    user: User;
    onCreateReel: (reelDetails: { caption: string; videoFile?: File }) => void;
}

const ReelComposer: React.FC<ReelComposerProps> = ({ user, onCreateReel }) => {
    const [caption, setCaption] = useState('');
    const [fileName, setFileName] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFileName(event.target.files[0].name);
            // In a real app, you would handle the file object itself.
        }
    };
    
    const handleSubmit = () => {
        if (caption.trim()) {
            onCreateReel({ caption });
            setCaption('');
            setFileName('');
        }
    };

    return (
        <div className="glass-card rounded-lg p-4">
            <div className="flex space-x-4">
                <img className="w-12 h-12 rounded-full ring-2 ring-white/50" src={user.avatarUrl} alt={user.name} />
                <div className="w-full space-y-3">
                     <h3 className="font-semibold text-theme-text-base">Create a New Reel</h3>
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full p-2 border-none rounded-md bg-transparent focus:ring-0 placeholder-theme-text-muted"
                        rows={2}
                        placeholder="Reel caption..."
                    />
                    <div className="border-t border-[var(--color-glass-border)] my-2"></div>
                    <label className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-md hover:bg-primary/20 cursor-pointer">
                        <VideoIcon className="w-5 h-5"/>
                        <span className="truncate">{fileName || 'Upload Video'}</span>
                        <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>
            </div>
            <div className="flex justify-end items-center mt-4">
                <button
                    onClick={handleSubmit}
                    disabled={!caption.trim()}
                    className="px-6 py-2 font-bold bg-primary text-on-primary rounded-full transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Post Reel
                </button>
            </div>
        </div>
    );
};

export default ReelComposer;