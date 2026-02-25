import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Toaster, toast } from 'sonner';
import { ArrowLeft, Mail } from 'lucide-react';
import { API_URL as API } from '../config';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API}/auth/forgot-password`, { email });
            setSubmitted(true);
            toast.success('Reset link sent if account exists!');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
            <SEO
                title="Forgot Password"
                description="Reset your Disability Pride Connect account password."
            />
            <Toaster position="top-center" richColors />

            <div className="w-full max-w-md">
                <Link to="/login" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8" data-testid="back-link">
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                </Link>

                <Card className="bg-[#18181B] border-[#27272A]" data-testid="forgot-password-card">
                    <CardHeader className="space-y-1">
                        <CardTitle className="font-lexend text-2xl">Reset Password</CardTitle>
                        <CardDescription className="text-zinc-400">
                            {submitted
                                ? "Check your email for the reset link. (For demo: check terminal logs)"
                                : "Enter your email address and we'll send you a link to reset your password."
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-zinc-200">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="input-dark"
                                        data-testid="forgot-email"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full btn-primary"
                                    disabled={loading}
                                    data-testid="forgot-submit"
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-12 h-12 rounded-full border border-[#27272A] flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-6 h-6 text-zinc-400" />
                                </div>
                                <p className="text-zinc-400 mb-6">
                                    If an account is associated with {email}, you will receive a password reset link shortly.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full border-[#27272A] hover:bg-[#27272A] text-white"
                                    onClick={() => setSubmitted(false)}
                                >
                                    Try another email
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
