import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL as API } from '../config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { MyEnAbLogo } from '../components/MyEnAbLogo';
import SEO from '../components/SEO';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (token) {
            verifyEmail();
        } else {
            setStatus('error');
            setMessage('Invalid verification link.');
        }
    }, [token]);

    const verifyEmail = async () => {
        try {
            const response = await axios.get(`${API}/auth/verify-email?token=${token}`);
            setStatus('success');
            setMessage(response.data.message || 'Your email has been successfully verified.');
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.detail || 'Verification failed. The link may be invalid or expired.');
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-8">
            <SEO title="Verify Email" description="Verify your MyEnAb account email address." />
            
            <div className="w-full max-w-md text-center">
                <div className="flex justify-center mb-8">
                    <MyEnAbLogo className="w-48 h-12" />
                </div>

                <Card className="bg-[#18181B] border-[#27272A]">
                    <CardHeader>
                        <CardTitle className="font-lexend text-2xl">
                            {status === 'verifying' && 'Verifying Email...'}
                            {status === 'success' && 'Email Verified!'}
                            {status === 'error' && 'Verification Result'}
                        </CardTitle>
                        <CardDescription>
                            {status === 'verifying' ? 'Please wait while we confirm your account.' : 'Account registration status'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex flex-col items-center">
                        {status === 'verifying' && (
                            <Loader2 className="w-16 h-16 text-inclusion-gold animate-spin" />
                        )}

                        {status === 'success' && (
                            <>
                                <CheckCircle2 className="w-16 h-16 text-green-500" />
                                <p className="text-zinc-300">{message}</p>
                                <Button asChild className="w-full btn-primary mt-4">
                                    <Link to="/login">
                                        Go to Login <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <XCircle className="w-16 h-16 text-red-500" />
                                <p className="text-zinc-300">{message}</p>
                                <Button asChild variant="outline" className="w-full btn-secondary mt-4">
                                    <Link to="/register">Back to Register</Link>
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
