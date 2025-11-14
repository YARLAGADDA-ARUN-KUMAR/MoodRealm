// D:\MoodRealm\frontend\src\App.jsx

import { Route, Routes } from 'react-router-dom';
import './App.css';
import AuthenticatedNav from './components/AuthenticatedNav';
import ProtectedRoute from './components/ProtectedRoute';
import UnAuthenticatedNav from './components/UnAuthenticatedNav';
import { useAuth } from './contexts/AuthContext';
import AICompanion from './pages/AICompanion';
import Create from './pages/Create';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile'; // ADD THIS
import SignUp from './pages/SignUp';
import Stories from './pages/Stories';

function App() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#0a0e27]">
            {user ? <AuthenticatedNav /> : <UnAuthenticatedNav />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/stories" element={<Stories />} />

                <Route
                    path="/create"
                    element={
                        <ProtectedRoute>
                            <Create />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ai-companion"
                    element={
                        <ProtectedRoute>
                            <AICompanion />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
