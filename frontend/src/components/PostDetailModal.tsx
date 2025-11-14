import React, { useState } from 'react';
import { Post, User, Language } from '../types.ts';
import { VerifiedIcon, HeartIcon, CommentIcon, ShareIcon, XMarkIcon } from './icons/Icons.tsx';
import AudioPlayer from './AudioPlayer.tsx';

interface PostDetailModalProps {
    post: Post;
    user: User | null;
    onClose: () => void;
    requestLogin: () => void;
    language: Language;
}

interface MockComment {
    id: number;
    author: { name: string; avatarUrl: string; };
    text: string;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, user, onClose, requestLogin, language }) => {
    const [mockComments, setMockComments] = useState<MockComment[]>([
        { id: 1, author: { name: 'Iraqi Voter', avatarUrl: 'https://i.pravatar.cc/150?u=voter1' }, text: 'This is a very important topic, thank you for raising it.'},
        { id: 2, author: { name: 'Concerned Citizen', avatarUrl: 'https://i.pravatar.cc/150?u=citizen2' }, text: 'What are the specific steps you will take to address this?'},
    ]);
    const [newComment, setNewComment] = useState('');

    const handleInteraction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        if (!user) {
            e.preventDefault();
            requestLogin();
        } else {
            action();
        }
    };
    
    // Mock handlers for modal interactions
    const handleLike = () => console.log('Liked post in modal');
    const handleShare = () => console.log('Share action placeholder in modal');
    
    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) {
            if (!user) requestLogin();
            return;
        }
        const commentToAdd: MockComment = {
            id: Date.now(),
            author: { name: user.name, avatarUrl: user.avatarUrl },
            text: newComment,
        };
        setMockComments(prev => [...prev, commentToAdd]);
        setNewComment('');
    };

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="glass-card rounded-xl shadow-xl w-full max-w-2xl relative max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                 <button
                    onClick={onClose}
                    className="sticky top-2 right-2 self-end z-10 bg-white/10 text-white rounded-full p-1 hover:bg-white/30"
                    aria-label="Close post detail"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                
                {/* Modal Content */}
                <div className="overflow-y-auto no-scrollbar px-4 pb-4">
                    {/* Author Header */}
                    <div className="flex items-center space-x-3">
                        <img className="w-11 h-11 rounded-full ring-2 ring-white/50" src={post.author.avatarUrl} alt={post.author.name} />
                        <div>
                            <p className="text-sm font-semibold text-theme-text-base flex items-center">
                                {post.author.name}
                                {post.author.verified && <VerifiedIcon className="w-4 h-4 text-primary ml-1.5" />}
                            </p>
                            <p className="text-xs text-theme-text-muted">{post.timestamp}</p>
                        </div>
                    </div>
                    
                    {/* Content */}
                    {post.type === 'VoiceNote' ? (
                        <AudioPlayer src={post.mediaUrl || ''} governorate={post.author.governorate} />
                    ) : (
                        <div className="my-4">
                            <p className="text-theme-text-base text-base whitespace-pre-line font-arabic">{post.content}</p>
                        </div>
                    )}

                    {/* Image */}
                    {post.mediaUrl && post.type !== 'VoiceNote' && (
                        <div className="px-2 pb-2">
                            <img
                                className="w-full object-contain max-h-[50vh] rounded-lg"
                                src={post.mediaUrl}
                                alt="Post media"
                            />
                        </div>
                    )}
                
                    {/* Actions */}
                    <div className="border-t border-[var(--color-glass-border)] mt-4">
                        <div className="flex justify-around items-center text-theme-text-base mt-2">
                            <button onClick={(e) => handleInteraction(e, handleLike)} className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-primary/10 w-full justify-center">
                                <HeartIcon className="w-6 h-6" />
                                <span className="font-semibold text-xs">Like</span>
                            </button>
                            <div className="flex flex-col items-center space-y-1 p-2 rounded-lg w-full justify-center text-primary">
                                <CommentIcon className="w-6 h-6" />
                                <span className="font-semibold text-xs">Comment</span>
                            </div>
                            <button onClick={(e) => handleInteraction(e, handleShare)} className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-primary/10 w-full justify-center">
                                <ShareIcon className="w-6 h-6" />
                                <span className="font-semibold text-xs">Share</span>
                            </button>
                        </div>
                    </div>

                    {/* Comment Section */}
                    <div className="mt-4 border-t border-[var(--color-glass-border)] pt-4 space-y-4">
                        <h3 className="font-bold">Comments ({mockComments.length})</h3>
                        {mockComments.map(comment => (
                             <div key={comment.id} className="flex items-start space-x-3">
                                <img className="w-8 h-8 rounded-full" src={comment.author.avatarUrl} alt={comment.author.name} />
                                <div className="flex-1 bg-black/20 p-2 rounded-lg">
                                    <p className="font-semibold text-sm">{comment.author.name}</p>
                                    <p className="text-sm">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                 {/* Comment Input Form */}
                <div className="sticky bottom-0 bg-[var(--color-glass-bg)] p-2 border-t border-[var(--color-glass-border)]">
                    <form onSubmit={handleAddComment} className="flex items-center space-x-2">
                         <img className="w-8 h-8 rounded-full" src={user?.avatarUrl || 'https://i.pravatar.cc/150?u=guest'} alt="Your avatar" />
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={user ? "Write a comment..." : "Log in to comment"}
                            className="flex-grow p-2 border border-[var(--color-glass-border)] rounded-full bg-white/10 placeholder-theme-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
                            disabled={!user}
                        />
                        <button type="submit" disabled={!newComment.trim()} className="px-4 py-2 text-sm font-bold bg-primary text-on-primary rounded-full disabled:opacity-50">Post</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostDetailModal;