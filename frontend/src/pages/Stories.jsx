import PostCard from '@/components/PostCard';
import api from '@/services/apiService';
import { BookOpen, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const sortOptions = [
    { label: 'Latest', value: 'latest' },
    { label: 'Most Liked', value: 'likes' },
    { label: 'Most Commented', value: 'comments' },
    { label: 'Shuffle', value: 'random' },
];

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [sortOption, setSortOption] = useState('latest');

    const fetchStories = async (pageNum = 1, sortValue = sortOption) => {
        try {
            setLoading(true);
            const { data } = await api.get(
                `/posts?contentType=Story&page=${pageNum}&sort=${sortValue}`,
            );

            if (pageNum === 1) {
                setStories(data);
            } else {
                setStories((prev) => [...prev, ...data]);
            }

            if (sortValue === 'random') {
                setHasMore(false);
            } else {
                setHasMore(data.length === 10);
            }
        } catch (error) {
            console.error('Error fetching stories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories(1, sortOption);
        setPage(1);
    }, [sortOption]);

    const loadMore = () => {
        if (sortOption === 'random' || !hasMore || loading) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchStories(nextPage, sortOption);
    };

    const handlePostUpdate = () => {
        fetchStories(1, sortOption);
        setPage(1);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        setPage(1);
    };

    const handleShuffle = () => {
        fetchStories(1, 'random');
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-white text-xl font-semibold">Sort by</h2>
                    <div className="flex items-center gap-3">
                        <select
                            value={sortOption}
                            onChange={handleSortChange}
                            className="px-4 py-2 bg-[#1a1f3a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#ec4899] transition"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {sortOption === 'random' && (
                            <button
                                type="button"
                                onClick={handleShuffle}
                                className="px-4 py-2 bg-[#ec4899] hover:bg-[#d63384] text-white rounded-lg transition"
                                disabled={loading}
                            >
                                Shuffle Again
                            </button>
                        )}
                    </div>
                </div>

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
                        {hasMore && sortOption !== 'random' && (
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
