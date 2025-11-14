import MoodFilter from '@/components/MoodFilter';
import PostCard from '@/components/PostCard';
import usePosts from '@/hooks/usePosts';
import { Loader2 } from 'lucide-react';

const sortOptions = [
    { label: 'All', value: 'random' },
    { label: 'Latest', value: 'latest' },
    { label: 'Most Liked', value: 'likes' },
    { label: 'Most Commented', value: 'comments' },
];

const Home = () => {
    const {
        posts,
        loading,
        page,
        hasMore,
        sortOption,
        setSortOption,
        mood,
        setMood,
        loadMore,
        refreshPosts,
    } = usePosts('/posts', 'random', 'All'); // default = random (All)

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    return (
        <div className="min-h-screen bg-[#0a0e27]">
            <MoodFilter selectedMood={mood} onMoodChange={setMood} />

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
                            <PostCard key={post._id} post={post} onUpdate={refreshPosts} />
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
