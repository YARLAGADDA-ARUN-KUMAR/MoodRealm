import PostCard from '@/components/PostCard';
import api from '@/services/apiService';
import { BookOpen, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Fetch stories
    const fetchStories = async (pageNum = 1) => {
        try {
            setLoading(true);
            // Fetch posts filtered by contentType=Story
            const { data } = await api.get(`/posts?contentType=Story&page=${pageNum}`);

            if (pageNum === 1) {
                setStories(data);
            } else {
                setStories((prev) => [...prev, ...data]);
            }

            setHasMore(data.length === 10); // If we get 10 posts, there might be more
        } catch (error) {
            console.error('Error fetching stories:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchStories(1);
    }, []);

    // Load more stories
    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchStories(nextPage);
    };

    // Handle post update (after report/delete)
    const handlePostUpdate = () => {
        fetchStories(1);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-[#0a0e27]">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <BookOpen className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Shared Stories
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Discover the journeys, lessons, and moments that connect us.
                    </p>
                </div>
            </div>

            {/* Stories Container */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                {loading && page === 1 ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-[#ec4899] animate-spin" />
                    </div>
                ) : stories.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg mb-2">No stories shared yet.</p>
                        <p className="text-gray-500">
                            Be the first to share your story with the community!
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Story Count */}
                        <div className="mb-6">
                            <p className="text-gray-400 text-center">
                                {stories.length} {stories.length === 1 ? 'story' : 'stories'} shared
                            </p>
                        </div>

                        {/* Stories Grid */}
                        {stories.map((story) => (
                            <PostCard key={story._id} post={story} onUpdate={handlePostUpdate} />
                        ))}

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="px-8 py-3 bg-[#1a1f3a] hover:bg-[#252a47] text-white rounded-lg transition disabled:opacity-50 flex items-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Loading...</span>
                                        </>
                                    ) : (
                                        <span>Load More Stories</span>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Inspirational Quote at Bottom */}
            <div className="border-t border-gray-800 py-8 mt-12">
                <p className="text-center text-gray-400 italic text-lg max-w-2xl mx-auto px-4">
                    "Stories are the creative conversion of life itself into a more powerful,
                    clearer, more meaningful experience."
                </p>
            </div>
        </div>
    );
};

export default Stories;
