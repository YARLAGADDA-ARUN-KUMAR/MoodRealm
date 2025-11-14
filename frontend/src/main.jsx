import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: '#1a1f3a',
                            color: '#fff',
                            border: '1px solid #334155',
                        },
                    }}
                />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
);
