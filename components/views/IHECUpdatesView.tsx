import React, { useState, useEffect } from 'react';
import { Post, User, Language } from '../../types.ts';
import * as api from '../../services/apiService.ts';
import PostCard from '../PostCard.tsx';
import Spinner from '../Spinner.tsx';
import { UI_TEXT } from '../../translations.ts';

interface IHECUpdatesViewProps {
    user: User | null;
    requestLogin: () => void;
    language: Language;
    onSelectAuthor: (author: User) => void;
    onSelectPost: (post: Post) => void;
}

const IHECUpdatesView: React.FC<IHECUpdatesViewProps> = ({ user, requestLogin, language, onSelectAuthor, onSelectPost }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const texts = UI_TEXT[language];

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const ihecPosts = await api.getIHECPosts();
                setPosts(ihecPosts);
            } catch (error) {
                console.error("Failed to fetch IHEC posts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="text-center mb-8 glass-card rounded-lg p-6">
                 <div className="flex justify-center mb-4">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Seal_of_the_Independent_High_Electoral_Commission.svg/200px-Seal_of_the_Independent_High_Electoral_Commission.svg.png" 
                        alt="IHEC Seal" 
                        className="h-16 w-auto bg-white rounded-full p-1" 
                    />
                </div>
                <h2 className="text-3xl font-bold font-arabic text-white">IHEC Official Updates</h2>
                <p className="text-theme-text-muted mt-2 max-w-2xl mx-auto">
                    Official announcements and updates from the Independent High Electoral Commission of Iraq.
                </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
                 {posts.length > 0 ? (
                    posts.map(post => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                            user={user} 
                            requestLogin={requestLogin} 
                            language={language} 
                            onSelectAuthor={onSelectAuthor} 
                            onSelectPost={onSelectPost} 
                        />
                    ))
                ) : (
                    <p className="text-center py-10 text-theme-text-muted">{texts.noPostsFound}</p>
                )}
            </div>
        </div>
    );
};

export default IHECUpdatesView;
