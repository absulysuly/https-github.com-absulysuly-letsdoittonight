import React, { useState, useRef } from 'react';
import { User } from '../types.ts';
import { XMarkIcon, PhotoIcon } from './icons/Icons.tsx';
import Spinner from './Spinner.tsx';

interface StoryComposerModalProps {
    user: User;
    onClose: () => void;
    onPostStory: (mediaFile: File) => void;
}

const StoryComposerModal: React.FC<StoryComposerModalProps> = ({ user, onClose, onPostStory }) => {
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const handlePost = () => {
        if (!mediaFile) return;
        setIsPosting(true);
        // The onPostStory prop will handle API call and closing the modal
        onPostStory(mediaFile);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 animate-fade-in">
             <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/75"
                aria-label="Close story composer"
            >
                <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="w-full max-w-sm h-full max-h-[80vh] flex flex-col items-center justify-center">
                {mediaPreview ? (
                    <div className="relative w-full h-full">
                        {mediaFile?.type.startsWith('video') ? (
                            <video src={mediaPreview} controls className="w-full h-full object-contain rounded-lg" />
                        ) : (
                            <img src={mediaPreview} alt="Story Preview" className="w-full h-full object-contain rounded-lg" />
                        )}
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-full border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center text-white cursor-pointer hover:border-white/50"
                    >
                        <PhotoIcon className="w-16 h-16 text-white/50 mb-4" />
                        <span className="font-semibold">Upload Photo or Video</span>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                )}
            </div>

            {mediaFile && (
                <button
                    onClick={handlePost}
                    disabled={isPosting}
                    className="absolute bottom-10 px-8 py-3 font-bold bg-primary text-on-primary rounded-full transition-all hover:brightness-110 disabled:opacity-50 flex items-center gap-2"
                >
                    {isPosting ? <Spinner /> : 'Post Story'}
                </button>
            )}
        </div>
    );
};

export default StoryComposerModal;