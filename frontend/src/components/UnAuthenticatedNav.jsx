import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const UnAuthenticatedNav = () => {
    return (
        <nav className="bg-[#0a0e27] border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <Sparkles className="w-8 h-8 text-[#ec4899]" />
                        <span className="text-2xl font-bold text-white">
                            <span className="text-[#ec4899]">Mood</span>Realm
                        </span>
                    </Link>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Link
                            to="/login"
                            className="px-3 sm:px-6 py-2 text-white hover:text-[#ec4899] transition"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="px-3 sm:px-6 py-2 rounded-lg bg-[#ec4899] hover:bg-[#d63384] text-white transition"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default UnAuthenticatedNav;
