import React, { useState, useEffect } from 'react';
import { Post } from '../types.ts';
import * as api from '../services/apiService.ts';

const HeroSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slides, setSlides] = useState<{ image: string; caption: string; subcaption: string; }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHeroPosts = async () => {
            setIsLoading(true);
            try {
                // Fetch recent posts. A dedicated endpoint like /api/posts/hero would be ideal.
                const allPosts = await api.getPosts({ type: 'Post' });
                
                // Filter for posts with media.
                const postsWithMedia = allPosts.filter(p => p.mediaUrl);

                // Efficiently get one post per unique author
                const uniqueAuthorPosts = Object.values(
                    postsWithMedia.reduce((acc, post) => {
                        if (!acc[post.author.id]) {
                            acc[post.author.id] = post;
                        }
                        return acc;
                    }, {} as Record<string, Post>)
                );

                // Take the first 5 unique posts for the hero section
                const featuredPosts = uniqueAuthorPosts.slice(0, 5);

                const formattedSlides = featuredPosts.map(p => ({
                    image: p.mediaUrl!,
                    caption: p.author.name,
                    subcaption: p.content.substring(0, 70) + '...',
                }));

                setSlides(formattedSlides);

            } catch (error) {
                console.error("Failed to fetch hero posts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHeroPosts();
    }, []);


    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000);
        return () => clearTimeout(timer);
    }, [currentIndex, slides.length]);
    
    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    if (isLoading) {
        return <div className="w-full aspect-[4/3] md:aspect-[2/1] lg:aspect-[3/1] rounded-lg bg-[var(--color-glass-bg)] animate-pulse"></div>;
    }

    if (slides.length === 0) {
        return null; // Don't render anything if there are no slides
    }

    return (
        <div className="w-full aspect-[4/3] md:aspect-[2/1] lg:aspect-[3/1] relative group rounded-lg overflow-hidden shadow-lg">
           <div className="w-full h-full relative">
                {slides.map((slide, slideIndex) => (
                    <div
                        key={slideIndex}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                            slideIndex === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img loading={slideIndex === 0 ? "eager" : "lazy"} fetchPriority={slideIndex === 0 ? "high" : "auto"} src={slide.image} alt={`Slide ${slideIndex + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
                            <h3 className="font-bold text-lg">{slide.caption}</h3>
                            <p className="text-sm">{slide.subcaption}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, slideIndex) => (
                     <button
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                            currentIndex === slideIndex ? 'bg-white' : 'bg-white/50 hover:bg-white'
                        }`}
                        aria-label={`Go to slide ${slideIndex + 1}`}
                     />
                ))}
            </div>
        </div>
    );
};

export default HeroSection;