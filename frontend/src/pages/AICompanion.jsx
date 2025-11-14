import ConfirmModal from '@/components/ConfirmModal';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/apiService';
import { Loader2, Send, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const AICompanion = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?._id) return;

            setHistoryLoading(true);
            try {
                const { data } = await api.get('/ai/chat/history');
                setMessages(data);
            } catch (error) {
                console.error('Error loading conversation:', error);
                toast.error('Could not load chat history.');
            } finally {
                setHistoryLoading(false);
            }
        };

        fetchHistory();
        inputRef.current?.focus();
    }, [user]);

    const handleSendMessage = async (e) => {
        if (typeof e.preventDefault === 'function') {
            e.preventDefault();
        }

        if (!input.trim() || loading) return;

        const userMessage = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date().toISOString(),
        };

        const optimisticMessages = [...messages, userMessage];
        setMessages(optimisticMessages);
        setInput('');
        setLoading(true);

        try {
            const { data } = await api.post('/ai/chat', {
                history: optimisticMessages.slice(0, -1),
                newMessage: userMessage.content,
            });

            const aiMessage = {
                role: 'assistant',
                content: data.reply,
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);

            const errorMessage = {
                role: 'assistant',
                content:
                    "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
                timestamp: new Date().toISOString(),
                isError: true,
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleClearConversation = () => {
        setIsClearModalOpen(true);
    };

    const confirmClearConversation = async () => {
        setIsClearing(true);
        try {
            await api.delete('/ai/chat/history');

            const clearedConversation = [
                {
                    role: 'assistant',
                    content: "Hello! I'm your AI companion. How can I support you today?",
                    timestamp: new Date().toISOString(),
                },
            ];
            setMessages(clearedConversation);
            toast.success('Conversation cleared');
        } catch (error) {
            console.error('Error clearing conversation:', error);
            toast.error('Failed to clear conversation');
        } finally {
            setIsClearing(false);
            setIsClearModalOpen(false);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <ConfirmModal
                isOpen={isClearModalOpen}
                onClose={() => setIsClearModalOpen(false)}
                onConfirm={confirmClearConversation}
                title="Clear Conversation"
                message="Are you sure you want to permanently delete this chat history?"
                confirmText="Clear"
                isLoading={isClearing}
            />

            <div className="min-h-screen bg-[#0a0e27] flex flex-col">
                <div className="bg-linear-to-r from-purple-600 to-pink-600 py-1 sticky top-16 z-40">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">AI Companion</h1>
                                    <p className="text-white/80 text-sm">
                                        Your supportive friend, always here to listen
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClearConversation}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition flex items-center space-x-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Clear</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        {historyLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="w-8 h-8 text-[#ec4899] animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${
                                            message.role === 'user'
                                                ? 'justify-end'
                                                : 'justify-start'
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[80%] sm:max-w-[70%] ${
                                                message.role === 'user'
                                                    ? 'bg-[#ec4899] text-white'
                                                    : message.isError
                                                    ? 'bg-red-500/20 border border-red-500 text-red-200'
                                                    : 'bg-[#1a1f3a] text-gray-200'
                                            } rounded-2xl px-4 py-3 shadow-lg`}
                                        >
                                            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                                                {message.content}
                                            </p>

                                            <div className="flex justify-end mt-1">
                                                <span
                                                    className={`text-xs ${
                                                        message.role === 'user'
                                                            ? 'text-white/70'
                                                            : 'text-gray-500'
                                                    }`}
                                                >
                                                    {formatTime(message.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-[#1a1f3a] rounded-2xl px-4 py-3 shadow-lg">
                                            <div className="flex items-center space-x-2">
                                                <Loader2 className="w-4 h-4 text-[#ec4899] animate-spin" />
                                                <span className="text-gray-400 text-sm">
                                                    SoulBot is typing...
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#0a0e27] border-t border-gray-800 sticky bottom-0">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                            <div className="flex-1">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                    placeholder="Type your message..."
                                    className="w-full px-4 py-3 bg-[#1a1f3a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#ec4899] transition resize-none"
                                    rows={1}
                                    style={{
                                        minHeight: '50px',
                                        maxHeight: '150px',
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="px-6 py-3 bg-[#ec4899] hover:bg-[#d63384] text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                style={{ minHeight: '50px' }}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </form>

                        <p className="text-gray-500 text-xs mt-2 text-center">
                            Press Enter to send • Shift + Enter for new line
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AICompanion;
