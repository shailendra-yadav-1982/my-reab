import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Toaster, toast } from 'sonner';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const userTypes = [
    { value: 'individual', label: 'Individual' },
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
    const defaultType = searchParams.get('type') === 'provider' ? 'service_provider' : 'individual';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        user_type: defaultType,
        organization_name: '',
        disability_categories: [],
        location: ''
    });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await register(formData);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const isOrganization = ['service_provider', 'ngo'].includes(formData.user_type);

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-12">
            <Toaster position="top-center" richColors />
            
            <div className="w-full max-w-lg">
                <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8" data-testid="back-link">
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>

                <Card className="bg-[#18181B] border-[#27272A]" data-testid="register-card">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center pride-border-left bg-[#121212]">
                                <span className="font-lexend font-bold text-lg">DP</span>
                            </div>
                            <span className="font-lexend font-semibold">Pride Connect</span>
                        </div>
                        <CardTitle className="font-lexend text-2xl">Create your account</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Join our global community of support and connection
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={6}
                                        className="input-dark pr-10"
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
                                <Label htmlFor="location" className="text-zinc-200">Location (Optional)</Label>
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

                            {formData.user_type === 'individual' && (
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
                                className="w-full btn-primary"
                                disabled={loading}
                                data-testid="register-submit"
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-zinc-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-white hover:underline" data-testid="login-link">
                                Sign in
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
