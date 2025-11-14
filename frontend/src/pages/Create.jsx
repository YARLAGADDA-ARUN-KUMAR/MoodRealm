// D:\MoodRealm\frontend\src\pages\Create.jsx

import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/apiService';
import { Image as ImageIcon, Loader2, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Create = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [content, setContent] = useState('');
    const [mood, setMood] = useState('Inspired');
    const [contentType, setContentType] = useState('Quote');
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [backgroundStyle, setBackgroundStyle] = useState('gradient');

    const [generatingContent, setGeneratingContent] = useState(false);
    const [posting, setPosting] = useState(false);

    const moods = [
        'Inspired',
        'Joyful',
        'Grateful',
        'Romantic',
        'Heartbroken',
        'Lonely',
        'Creative',
        'Motivated',
        'Anxious',
        'Funny',
        'Neutral',
    ];

    const contentTypes = ['Quote', 'Life Lesson', 'Story', 'Flirty Line', 'Poem', 'Thought'];

    const handleInspire = async () => {
        if (!mood || !contentType) {
            alert('Please select a mood and content type first');
            return;
        }

        setGeneratingContent(true);
        try {
            const { data } = await api.post('/ai/generate-content', {
                mood,
                contentType,
            });
            setContent(data.content);
        } catch (error) {
            console.error('Error generating content:', error);
            alert('Failed to generate content. Please try again.');
        } finally {
            setGeneratingContent(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackgroundImage(reader.result);
                setBackgroundStyle('image');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            alert('Please write something before posting');
            return;
        }

        setPosting(true);
        try {
            await api.post('/posts', {
                content: content.trim(),
                mood,
                contentType,
                backgroundImage: backgroundStyle === 'image' ? backgroundImage : null,
                backgroundStyle,
            });

            navigate('/');
            alert('Post created successfully!');
        } catch (error) {
            console.error('Error creating post:', error);
            alert(error.response?.data?.message || 'Failed to create post');
        } finally {
            setPosting(false);
        }
    };

    const getMoodColor = (moodName) => {
        const colors = {
            Inspired: 'from-blue-500 to-purple-600',
            Joyful: 'from-yellow-400 to-orange-500',
            Grateful: 'from-green-400 to-teal-500',
            Romantic: 'from-pink-500 to-red-500',
            Heartbroken: 'from-gray-500 to-blue-900',
            Lonely: 'from-indigo-900 to-gray-800',
            Creative: 'from-purple-500 to-pink-500',
            Motivated: 'from-orange-500 to-red-600',
            Anxious: 'from-gray-600 to-purple-900',
            Funny: 'from-yellow-300 to-green-400',
            Neutral: 'from-gray-600 to-gray-800',
        };
        return colors[moodName] || colors.Neutral;
    };

    return (
        <div className="min-h-screen bg-[#0a0e27] py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Share your thoughts</h1>
                    <p className="text-gray-400">
                        Write your own story, quote, or lesson. Your voice matters here.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-[#1a1f3a] rounded-lg p-6 border border-gray-800">
                        <div className="relative">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Pour your heart out..."
                                className="w-full h-40 px-4 py-3 bg-[#0a0e27] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#ec4899] transition resize-none"
                                maxLength={500}
                            />
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-sm text-gray-500">
                                    {content.length}/500 characters
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Content Type
                            </label>
                            <select
                                value={contentType}
                                onChange={(e) => setContentType(e.target.value)}
                                className="w-full px-4 py-3 bg-[#1a1f3a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#ec4899] transition"
                            >
                                {contentTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Mood
                            </label>
                            <select
                                value={mood}
                                onChange={(e) => setMood(e.target.value)}
                                className="w-full px-4 py-3 bg-[#1a1f3a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#ec4899] transition"
                            >
                                {moods.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-[#1a1f3a] rounded-lg p-6 border border-gray-800">
                        <h3 className="text-white font-semibold mb-4">Customize your background</h3>
                        <label className="cursor-pointer">
                            <div className="border-2 border-dashed border-gray-700 rounded-lg p-2 hover:border-[#ec4899] transition text-center">
                                <ImageIcon className="w-8 h-8 text-gray-500 mx-auto mb-1" />
                                <span className="text-gray-400 text-sm">Upload Custom Image</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Preview</h3>
                        <div
                            className={`relative rounded-2xl p-8 min-h-[300px] flex flex-col justify-between overflow-hidden ${
                                backgroundStyle === 'gradient'
                                    ? `bg-gradient-to-br ${getMoodColor(mood)}`
                                    : ''
                            }`}
                            style={
                                backgroundStyle === 'image' && backgroundImage
                                    ? {
                                          backgroundImage: `url(${backgroundImage})`,
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center',
                                      }
                                    : {}
                            }
                        >
                            {backgroundStyle === 'image' && backgroundImage && (
                                <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
                            )}

                            <div className="relative z-10 flex justify-end mb-4">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                                    {contentType}
                                </span>
                            </div>

                            <div className="relative z-10 flex-1 flex items-center justify-center">
                                <p className="text-white text-xl md:text-2xl font-serif italic text-center leading-relaxed">
                                    {content
                                        ? `"${content}"`
                                        : '"Your content will appear here..."'}
                                </p>
                            </div>

                            <div className="relative z-10 flex justify-between items-center mt-4">
                                <span className="text-white/90 font-medium">- {user?.name}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                        <button
                            type="button"
                            onClick={handleInspire}
                            disabled={generatingContent}
                            className="flex items-center space-x-2 px-6 py-3 bg-[#1a1f3a] hover:bg-[#252a47] text-white rounded-lg transition disabled:opacity-50"
                        >
                            {generatingContent ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>Inspire</span>
                                </>
                            )}
                        </button>

                        <button
                            type="submit"
                            disabled={posting || !content.trim()}
                            className="flex items-center space-x-2 px-8 py-3 bg-[#ec4899] hover:bg-[#d63384] text-white rounded-lg transition disabled:opacity-50 font-semibold"
                        >
                            {posting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Posting...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>Post</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Create;
