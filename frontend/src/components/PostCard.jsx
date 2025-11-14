import { useAuth } from '@/contexts/AuthContext';
import { getMoodColor } from '@/lib/utils';
import api from '@/services/apiService';
import { Flag, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';

const PostCard = ({ post, onUpdate }) => {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(user ? post.likes.includes(user._id) : false);
    const [likesCount, setLikesCount] = useState(post.likes.length);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(post.comments || []);
    const [loading, setLoading] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isReporting, setIsReporting] = useState(false);

    const contentRef = useRef(null);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;

        setIsScrollable(el.scrollHeight > el.clientHeight);
    }, [post.content]);

    const handleLike = async () => {
        if (!user) return toast.error('Please login to like posts');

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
        if (!user) return toast.error('Please login to comment');
        if (!comment.trim()) return;

        setLoading(true);
        try {
            const { data } = await api.post(`/posts/${post._id}/comment`, { text: comment });
            setComments(data);
            setComment('');
        } catch (error) {
            toast.error('Failed to add comment' + error);
        }
        setLoading(false);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: 'MoodRealm Post', text: post.content });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    return (
        <>
            <ConfirmModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onConfirm={async () => {
                    setIsReporting(true);
                    try {
                        await api.post(`/posts/${post._id}/report`);
                        toast.success('Post reported successfully');
                        if (onUpdate) onUpdate();
                    } catch {
                        toast.error('Failed to report post');
                    }
                    setIsReporting(false);
                }}
                title="Report Post"
                message="Are you sure you want to report this post as inappropriate?"
                confirmText="Report"
                isLoading={isReporting}
            />

            <div className="mb-6">
                <div
                    className={`relative rounded-2xl p-8 bg-gradient-to-br ${getMoodColor(
                        post.mood,
                    )} h-[350px] flex flex-col overflow-hidden`}
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

                    <div className="relative z-10 flex justify-end mb-2">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                            {post.contentType}
                        </span>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col min-h-0">
                        <div
                            ref={contentRef}
                            className={`w-full flex-1 px-1 min-h-0
            ${
                isScrollable
                    ? 'overflow-y-auto flex items-start'
                    : 'flex items-center justify-center'
            }
        `}
                        >
                            <p className="text-white text-xl md:text-2xl font-serif leading-relaxed whitespace-pre-wrap">
                                {post.content}
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 flex justify-between items-center mt-2">
                        <span className="text-white/90 font-medium">- {post.user?.name}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 px-2">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={handleLike}
                            className="flex items-center space-x-2 text-gray-400 hover:text-[#ec4899]"
                        >
                            <Heart
                                className={`w-5 h-5 ${
                                    isLiked ? 'fill-[#ec4899] text-[#ec4899]' : ''
                                }`}
                            />
                            <span>{likesCount}</span>
                        </button>

                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center space-x-2 text-gray-400 hover:text-blue-500"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>{comments.length}</span>
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center space-x-2 text-gray-400 hover:text-green-500"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>

                    {user && post.user?._id !== user._id && (
                        <button onClick={() => setIsReportModalOpen(true)} className="text-red-500">
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
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="flex-1 px-4 py-2 bg-[#0a0e27] border border-gray-700 rounded-lg text-white"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || !comment.trim()}
                                        className="px-6 py-2 bg-[#ec4899] hover:bg-[#d63384] text-white rounded-lg"
                                    >
                                        {loading ? 'Posting...' : 'Post'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {comments.map((c) => (
                            <div key={c._id} className="p-3 bg-[#0a0e27] rounded-lg mb-2">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-semibold text-white text-sm">
                                        {c.user?.name}
                                    </span>
                                    <span className="text-gray-500 text-xs">
                                        {new Date(c.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                                    {c.text}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default PostCard;
