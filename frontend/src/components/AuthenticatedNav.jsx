import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Home, LogOut, PlusCircle, Sparkles, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AuthenticatedNav = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-[#0a0e27] border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <NavLink to="/" className="flex items-center space-x-2">
                        <Sparkles className="w-8 h-8 text-[#ec4899]" />
                        <span className="text-2xl font-bold text-white">
                            <span className="text-[#ec4899]">Soul</span>Spark
                        </span>
                    </NavLink>

                    <div className="flex items-center space-x-1">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition ${
                                    isActive ? 'bg-[#ec4899]' : 'hover:bg-[#1a1f3a]'
                                }`
                            }
                        >
                            <Home className="w-5 h-5" />
                            <span>Feed</span>
                        </NavLink>

                        <NavLink
                            to="/stories"
                            className={({ isActive }) =>
                                `flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition ${
                                    isActive ? 'bg-[#ec4899]' : 'hover:bg-[#1a1f3a]'
                                }`
                            }
                        >
                            <BookOpen className="w-5 h-5" />
                            <span>Stories</span>
                        </NavLink>

                        <NavLink
                            to="/create"
                            className={({ isActive }) =>
                                `flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition ${
                                    isActive ? 'bg-[#ec4899]' : 'hover:bg-[#1a1f3a]'
                                }`
                            }
                        >
                            <PlusCircle className="w-5 h-5" />
                            <span>Create</span>
                        </NavLink>

                        <NavLink
                            to="/ai-companion"
                            className={({ isActive }) =>
                                `flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition ${
                                    isActive ? 'bg-[#ec4899]' : 'hover:bg-[#1a1f3a]'
                                }`
                            }
                        >
                            <Sparkles className="w-5 h-5" />
                            <span>AI Companion</span>
                        </NavLink>
                    </div>

                    <div className="flex items-center space-x-4">
                        <NavLink
                            to="/profile"
                            className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
                        >
                            <User className="w-5 h-5" />
                            <span className="hidden md:inline">{user?.name}</span>
                        </NavLink>

                        <button
                            onClick={logout}
                            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition flex items-center space-x-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AuthenticatedNav;
