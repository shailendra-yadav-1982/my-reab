import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function SSOCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setToken } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (token) {
            // Store token and update axios headers
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // We need a way to trigger a state update in AuthContext
            // If AuthContext exposes setToken, we use it.
            // Based on our implementation, we might need to refresh or use a specific method.
            if (setToken) {
                setToken(token);
            }

            navigate('/dashboard', { replace: true });
        } else if (error) {
            navigate(`/login?error=${error}`, { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    }, [searchParams, navigate, setToken]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090B] text-white">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pride-gold mx-auto mb-4"></div>
                <h2 className="text-xl font-lexend font-semibold">Completing sign in...</h2>
                <p className="text-zinc-400 mt-2">Please wait while we set up your session.</p>
            </div>
        </div>
    );
}
