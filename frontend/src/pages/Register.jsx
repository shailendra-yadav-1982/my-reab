import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Toaster, toast } from 'sonner';
import { Eye, EyeOff, ArrowLeft, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { MyEnAbLogo } from '../components/MyEnAbLogo';

const userTypes = [
    { value: 'individual_disabled', label: 'Individual Disabled' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'service_provider', label: 'Service Provider' },
    { value: 'ngo', label: 'NGO / Non-Profit' },
    { value: 'caregiver', label: 'Caregiver / Family Member' }
];

const disabilityCategories = [
    { value: 'physical', label: 'Physical', color: '#FF5C5C' },
    { value: 'cognitive', label: 'Cognitive / Neurodivergent', color: '#FFD700' },
    { value: 'invisible', label: 'Invisible / Undiagnosed', color: '#F4F4F5' },
    { value: 'psychiatric', label: 'Psychiatric / Emotional', color: '#38BDF8' },
    { value: 'sensory', label: 'Sensory', color: '#34D399' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say', color: '#71717A' }
];

export default function Register() {
    const [searchParams] = useSearchParams();
    const defaultType = searchParams.get('type') === 'provider' ? 'service_provider' : 'individual_disabled';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        user_type: defaultType,
        organization_name: '',
        disability_categories: [],
        location: ''
    });
    const [verificationSent, setVerificationSent] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleCategoryToggle = (category) => {
        setFormData(prev => ({
            ...prev,
            disability_categories: prev.disability_categories.includes(category)
                ? prev.disability_categories.filter(c => c !== category)
                : [...prev.disability_categories, category]
        }));
    };

    const passwordRequirements = [
        { id: 'length', text: 'At least 8 characters', test: (pw) => pw.length >= 8 },
        { id: 'upper', text: 'At least one uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
        { id: 'lower', text: 'At least one lowercase letter', test: (pw) => /[a-z]/.test(pw) },
        { id: 'number', text: 'At least one number', test: (pw) => /[0-9]/.test(pw) },
        { id: 'special', text: 'At least one special character (@$!%*?&)', test: (pw) => /[@$!%*?&]/.test(pw) },
    ];

    const isPasswordStrong = passwordRequirements.every(req => req.test(formData.password));
    const passwordsMatch = formData.password === formData.confirmPassword;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isPasswordStrong) {
            toast.error('Please meet all password requirements');
            return;
        }
        if (!passwordsMatch) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Remove confirmPassword from data sent to server
            const { confirmPassword, ...registerData } = formData;
            const response = await register(registerData);
            
            if (response.requires_verification) {
                setVerificationSent(true);
                toast.success('Registration successful! Please verify your email.');
            } else {
                toast.success('Account created successfully!');
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };


    const isOrganization = ['service_provider', 'ngo'].includes(formData.user_type);

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-12">
            <SEO
                title="Join Us"
                description="Create an account and join our inclusive community. Connect with advocacy groups, service providers, and more."
            />
            <Toaster position="top-center" richColors />

            <div className="w-full max-w-lg">
                <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8" data-testid="back-link">
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>

                <Card className="bg-[#18181B] border-[#27272A]" data-testid="register-card">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center mb-4">
                            <MyEnAbLogo className="w-56 h-16" />
                        </div>
                        <CardTitle className="font-lexend text-2xl">Create your account</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Join our global community of support and connection
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {verificationSent ? (
                            <div className="text-center space-y-6 py-8">
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 bg-inclusion-gold/10 rounded-full flex items-center justify-center">
                                        <Mail className="w-8 h-8 text-inclusion-gold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-lexend font-bold">Check your email</h3>
                                    <p className="text-zinc-400">
                                        We've sent a verification link to <span className="text-white font-medium">{formData.email}</span>.
                                        Please click the link to verify your account.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <Button asChild variant="outline" className="btn-secondary w-full text-white">
                                        <Link to="/login">Back to Login</Link>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-zinc-200">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="input-dark"
                                        data-testid="register-name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-zinc-200">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="input-dark"
                                        data-testid="register-email"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-zinc-200">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Create a strong password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            className={`input-dark pr-10 ${formData.password && !isPasswordStrong ? 'border-red-500/50' : ''}`}
                                            data-testid="register-password"
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
                                    {formData.password && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                                            {passwordRequirements.map(req => (
                                                <div key={req.id} className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold">
                                                    {req.test(formData.password) ? (
                                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-3 h-3 text-zinc-600" />
                                                    )}
                                                    <span className={req.test(formData.password) ? 'text-green-500' : 'text-zinc-500'}>
                                                        {req.text}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-zinc-200">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Repeat your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                        className={`input-dark ${formData.confirmPassword && !passwordsMatch ? 'border-red-500/50' : ''}`}
                                        data-testid="register-confirm-password"
                                    />
                                    {formData.confirmPassword && !passwordsMatch && (
                                        <p className="text-xs text-red-500">Passwords do not match</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="user_type" className="text-zinc-200">I am a...</Label>
                                    <Select
                                        value={formData.user_type}
                                        onValueChange={(value) => setFormData({ ...formData, user_type: value })}
                                    >
                                        <SelectTrigger className="input-dark" data-testid="register-user-type">
                                            <SelectValue placeholder="Select your role" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#18181B] border-[#27272A]">
                                            {userTypes.map(type => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {isOrganization && (
                                    <div className="space-y-2">
                                        <Label htmlFor="organization_name" className="text-zinc-200">Organization Name</Label>
                                        <Input
                                            id="organization_name"
                                            type="text"
                                            placeholder="Your organization"
                                            value={formData.organization_name}
                                            onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                                            className="input-dark"
                                            data-testid="register-org-name"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-zinc-200">Location</Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        placeholder="City, Country"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="input-dark"
                                        data-testid="register-location"
                                    />
                                </div>

                                {formData.user_type === 'individual_disabled' && (
                                    <div className="space-y-3">
                                        <Label className="text-zinc-200">Disability Categories (Optional)</Label>
                                        <p className="text-xs text-zinc-500">Select all that apply</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {disabilityCategories.map(category => (
                                                <div
                                                    key={category.value}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Checkbox
                                                        id={category.value}
                                                        checked={formData.disability_categories.includes(category.value)}
                                                        onCheckedChange={() => handleCategoryToggle(category.value)}
                                                        className="border-zinc-600 data-[state=checked]:bg-white data-[state=checked]:border-white"
                                                        data-testid={`category-${category.value}`}
                                                    />
                                                    <label
                                                        htmlFor={category.value}
                                                        className="text-sm cursor-pointer flex items-center gap-2"
                                                    >
                                                        <span
                                                            className="w-2 h-2 rounded-full"
                                                            style={{ backgroundColor: category.color }}
                                                        ></span>
                                                        {category.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full btn-primary mt-6"
                                    disabled={loading}
                                    data-testid="register-submit"
                                >
                                    {loading ? 'Creating account...' : 'Create Account'}
                                </Button>
                            </form>
                        )}

                        {!verificationSent && (
                            <div className="mt-6 text-center text-sm text-zinc-400">
                                Already have an account?{' '}
                                <Link to="/login" className="text-white hover:underline" data-testid="login-link">
                                    Sign in
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Inclusion colors decoration */}
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
