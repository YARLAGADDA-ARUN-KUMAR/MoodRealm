import MoodFilter from '@/components/MoodFilter';
import PostCard from '@/components/PostCard';
import api from '@/services/apiService';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const sortOptions = [
    { label: 'Latest', value: 'latest' },
    { label: 'Most Liked', value: 'likes' },
    { label: 'Most Commented', value: 'comments' },
    { label: 'Shuffle', value: 'random' },
];

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMood, setSelectedMood] = useState('All');
    const [sortOption, setSortOption] = useState('latest');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async (moodFilter = 'All', pageNum = 1, sortValue = sortOption) => {
        try {
            setLoading(true);
            const moodParam = moodFilter === 'All' ? 'all' : moodFilter;
            const { data } = await api.get(
                `/posts?mood=${moodParam}&page=${pageNum}&sort=${sortValue}`,
            );

            if (pageNum === 1) {
                setPosts(data);
            } else {
                setPosts((prev) => [...prev, ...data]);
            }

            if (sortValue === 'random') {
                setHasMore(false);
            } else {
                setHasMore(data.length === 10);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(selectedMood, 1, sortOption);
        setPage(1);
    }, [selectedMood, sortOption]);

    const handleMoodChange = (mood) => {
        setSelectedMood(mood);
        setPage(1);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        setPage(1);
    };

    const loadMore = () => {
        if (sortOption === 'random' || !hasMore || loading) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(selectedMood, nextPage, sortOption);
    };

    const handlePostUpdate = () => {
        fetchPosts(selectedMood, 1, sortOption);
        setPage(1);
    };

    const handleShuffle = () => {
        fetchPosts(selectedMood, 1, 'random');
    };

    return (
        <div className="min-h-screen bg-[#0a0e27]">
            <MoodFilter selectedMood={selectedMood} onMoodChange={handleMoodChange} />

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
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">
                            No posts found for this mood. Be the first to share!
                        </p>
                    </div>
                ) : (
                    <>
                        {posts.map((post) => (
                            <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
                        ))}

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
                                        <span>Load More</span>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
