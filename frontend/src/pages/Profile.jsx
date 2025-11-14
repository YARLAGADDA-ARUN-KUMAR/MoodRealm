import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/apiService';
import { Calendar, Heart, Loader2, MessageCircle, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingPostId, setDeletingPostId] = useState(null);
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
    });

    // Fetch user posts
    const fetchUserPosts = async () => {
        if (!user?._id) return;

        try {
            setLoading(true);
            const { data } = await api.get(`/posts/user/${user._id}`);
            setPosts(data);

            const totalLikes = data.reduce((sum, post) => sum + post.likes.length, 0);
            const totalComments = data.reduce((sum, post) => sum + post.comments.length, 0);

            setStats({
                totalPosts: data.length,
                totalLikes,
                totalComments,
            });
        } catch (error) {
            console.error('Error fetching user posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPosts();
    }, [user]);

    // Delete Post
    const handleDeletePost = async (postId) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        setDeletingPostId(postId);

        const postToDelete = posts.find((p) => p._id === postId) || { likes: [], comments: [] };

        try {
            await api.delete(`/posts/${postId}`);

            // Update posts
            setPosts((prev) => prev.filter((p) => p._id !== postId));

            // Update stats
            setStats((prev) => ({
                totalPosts: prev.totalPosts - 1,
                totalLikes: prev.totalLikes - postToDelete.likes.length,
                totalComments: prev.totalComments - postToDelete.comments.length,
            }));

            alert('Post deleted successfully');
        } catch (error) {
            alert('Failed to delete post');
            console.error(error);
        } finally {
            setDeletingPostId(null);
        }
    };

    // Mood colors
    const getMoodColor = (mood) => {
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
        return colors[mood] ?? colors.Neutral;
    };

    const formatDate = (date) => {
        if (!date) return '—';
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) return '—';
        return parsedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-[#0a0e27] py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8">
                    <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                            <User className="w-12 h-12 text-white" />
                        </div>

                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
                            <p className="text-white/80">{user?.email}</p>
                            <p className="text-white/60 text-sm mt-2">
                                Member since {formatDate(user?.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-white mb-1">
                                {stats.totalPosts}
                            </div>
                            <div className="text-white/70 text-sm">Posts</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-white mb-1">
                                {stats.totalLikes}
                            </div>
                            <div className="text-white/70 text-sm">Likes Received</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-white mb-1">
                                {stats.totalComments}
                            </div>
                            <div className="text-white/70 text-sm">Comments</div>
                        </div>
                    </div>
                </div>

                {/* Section */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">Your Posts</h2>
                    <p className="text-gray-400 mt-1">Manage and view all your shared content</p>
                </div>

                {/* Posts */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-[#ec4899] animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg mb-4">
                            You haven't created any posts yet.
                        </p>

                        <Link
                            to="/create"
                            className="inline-block px-6 py-3 bg-[#ec4899] hover:bg-[#d63384] text-white rounded-lg transition"
                        >
                            Create Your First Post
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div
                                key={post._id}
                                className="bg-[#1a1f3a] rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition"
                            >
                                {/* Post Preview */}
                                <div
                                    className={`relative h-48 bg-gradient-to-br ${getMoodColor(
                                        post.mood,
                                    )} p-4 flex items-center justify-center`}
                                    style={
                                        post.backgroundImage
                                            ? {
                                                  backgroundImage: `url(${post.backgroundImage})`,
                                                  backgroundSize: 'cover',
                                                  backgroundPosition: 'center',
                                              }
                                            : {}
                                    }
                                >
                                    {post.backgroundImage && (
                                        <div className="absolute inset-0 bg-black/40"></div>
                                    )}

                                    <div className="absolute top-2 right-2 z-10">
                                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                                            {post.contentType}
                                        </span>
                                    </div>

                                    <p className="relative z-10 text-white text-sm text-center line-clamp-4 italic">
                                        "{post.content}"
                                    </p>
                                </div>

                                {/* Post Info */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="px-3 py-1 bg-[#0a0e27] text-gray-300 text-xs rounded-full">
                                            {post.mood}
                                        </span>
                                        <div className="flex items-center space-x-1 text-gray-500 text-xs">
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatDate(post.createdAt)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-gray-400 text-sm mb-3">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <Heart className="w-4 h-4" />
                                                <span>{post.likes.length}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>{post.comments.length}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDeletePost(post._id)}
                                        disabled={deletingPostId === post._id}
                                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
                                    >
                                        {deletingPostId === post._id ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Deleting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4" />
                                                <span>Delete Post</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
