import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Toaster, toast } from 'sonner';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

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
            <Toaster position="top-center" richColors />
            
            <div className="w-full max-w-md">
                <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8" data-testid="back-link">
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>

                <Card className="bg-[#18181B] border-[#27272A]" data-testid="login-card">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center pride-border-left bg-[#121212]">
                                <span className="font-lexend font-bold text-lg">DP</span>
                            </div>
                            <span className="font-lexend font-semibold">Pride Connect</span>
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
                    <span className="w-3 h-3 rounded-full bg-pride-red"></span>
                    <span className="w-3 h-3 rounded-full bg-pride-gold"></span>
                    <span className="w-3 h-3 rounded-full bg-pride-white"></span>
                    <span className="w-3 h-3 rounded-full bg-pride-blue"></span>
                    <span className="w-3 h-3 rounded-full bg-pride-green"></span>
                </div>
            </div>
        </div>
    );
}
