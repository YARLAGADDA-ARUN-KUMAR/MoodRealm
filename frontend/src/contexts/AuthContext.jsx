/* eslint-disable react-refresh/only-export-components */
import api from '@/services/apiService';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('moodRealmToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (token) {
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    const { data } = await api.get('/users/profile');
                    setUser(data);

                    localStorage.setItem('moodRealmUser', JSON.stringify(data));
                } catch (error) {
                    console.error('Auth fetch error:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, [token]);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/users/login', { email, password });
            setUser(data);
            setToken(data.token);
            localStorage.setItem('moodRealmUser', JSON.stringify(data));
            localStorage.setItem('moodRealmToken', data.token); // BUG FIX: Persist token
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return { success: true };
        } catch (error) {
            console.error('Login failed', error.response?.data?.message || error.message);
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const { data } = await api.post('/users/signup', { name, email, password });
            setUser(data);
            setToken(data.token);
            localStorage.setItem('moodRealmUser', JSON.stringify(data));
            localStorage.setItem('moodRealmToken', data.token); // BUG FIX: Persist token
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return { success: true };
        } catch (error) {
            console.error('Signup failed', error.response?.data?.message || error.message);
            return {
                success: false,
                error: error.response?.data?.message || 'Signup failed',
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('moodRealmToken');
        localStorage.removeItem('moodRealmUser');
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
