import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Toaster, toast } from 'sonner';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { MyEnAbLogo } from '../components/MyEnAbLogo';
import { API_URL as API } from '../config';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
            <SEO
                title="Login"
                description="Sign in to your MyEnAb account to connect with the community."
            />
            <Toaster position="top-center" richColors />

            <div className="w-full max-w-md">
                <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8" data-testid="back-link">
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>

                <Card className="bg-[#18181B] border-[#27272A]" data-testid="login-card">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center mb-4">
                            <MyEnAbLogo className="w-56 h-16" />
                        </div>
                        <CardTitle className="font-lexend text-2xl">Welcome back</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-200">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="input-dark"
                                    data-testid="login-email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-zinc-200">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="input-dark pr-10"
                                        data-testid="login-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        data-testid="toggle-password"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="flex justify-end">
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs text-zinc-500 hover:text-white transition-colors"
                                        data-testid="forgot-password-link"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full btn-primary"
                                disabled={loading}
                                data-testid="login-submit"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-[#27272A]"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#18181B] px-2 text-zinc-500">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full border-[#27272A] hover:bg-[#27272A] text-white"
                            onClick={() => window.location.href = `${API}/auth/sso/login`}
                            data-testid="sso-login-btn"
                        >
                            Log in with SSO
                        </Button>

                        <div className="mt-6 text-center text-sm text-zinc-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-white hover:underline" data-testid="register-link">
                                Create one
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Pride colors decoration */}
                <div className="flex justify-center gap-2 mt-8">
                    <span className="w-3 h-3 rounded-full bg-[#E40303]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#FF8C00]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#FFD700]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#008026]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#24408E]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#732982]"></span>
                </div>
            </div>
        </div>
    );
}
