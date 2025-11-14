import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/apiService';
import { Flag, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useState } from 'react';

const PostCard = ({ post, onUpdate }) => {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(user ? post.likes.includes(user._id) : false);
    const [likesCount, setLikesCount] = useState(post.likes.length);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(post.comments || []);
    const [loading, setLoading] = useState(false);

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
        return colors[mood] || colors.Neutral;
    };

    const handleLike = async () => {
        if (!user) {
            alert('Please login to like posts');
            return;
        }

        try {
            const { data } = await api.post(`/posts/${post._id}/like`);
            setIsLiked(!isLiked);
            setLikesCount(data.likes);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to comment');
            return;
        }
        if (!comment.trim()) return;

        setLoading(true);
        try {
            const { data } = await api.post(`/posts/${post._id}/comment`, {
                text: comment,
            });
            setComments(data);
            setComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        }
        setLoading(false);
    };

    const handleReport = async () => {
        if (!user) {
            alert('Please login to report posts');
            return;
        }

        if (window.confirm('Are you sure you want to report this post?')) {
            try {
                await api.post(`/posts/${post._id}/report`);
                alert('Post reported successfully');
                if (onUpdate) onUpdate();
            } catch (error) {
                console.error('Error reporting post:', error);
                alert('Failed to report post');
            }
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'SoulSpark Post',
                text: post.content,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="mb-6">
            <div
                className={`relative rounded-2xl p-8 bg-gradient-to-br ${getMoodColor(
                    post.mood,
                )} min-h-[300px] flex flex-col justify-between overflow-hidden`}
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
                    <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
                )}

                <div className="relative z-10 flex justify-end mb-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                        {post.contentType}
                    </span>
                </div>

                <div className="relative z-10 flex-1 flex items-center justify-center">
                    <p className="text-white text-xl md:text-2xl font-serif italic text-center leading-relaxed">
                        "{post.content}"
                    </p>
                </div>

                <div className="relative z-10 flex justify-between items-center mt-4">
                    <span className="text-white/90 font-medium">
                        - {post.user?.name || 'Anonymous'}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 px-2">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={handleLike}
                        className="flex items-center space-x-2 text-gray-400 hover:text-[#ec4899] transition"
                    >
                        <Heart
                            className={`w-5 h-5 ${isLiked ? 'fill-[#ec4899] text-[#ec4899]' : ''}`}
                        />
                        <span>{likesCount}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span>{comments.length}</span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center space-x-2 text-gray-400 hover:text-green-500 transition"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                {user && post.user?._id !== user._id && (
                    <button onClick={handleReport} className="text-red-500 transition">
                        <Flag className="w-5 h-5" />
                    </button>
                )}
            </div>

            {showComments && (
                <div className="mt-4 p-4 bg-[#1a1f3a] rounded-lg border border-gray-800">
                    {user && (
                        <form onSubmit={handleCommentSubmit} className="mb-4">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 px-4 py-2 bg-[#0a0e27] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#ec4899] transition"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !comment.trim()}
                                    className="px-6 py-2 bg-[#ec4899] hover:bg-[#d63384] text-white rounded-lg transition disabled:opacity-50"
                                >
                                    {loading ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-3">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                                No comments yet. Be the first!
                            </p>
                        ) : (
                            comments.map((c) => (
                                <div key={c._id} className="p-3 bg-[#0a0e27] rounded-lg">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-semibold text-white text-sm">
                                            {c.user?.name || 'User'}
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm">{c.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;
