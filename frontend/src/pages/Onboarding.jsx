import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { MyEnAbLogo } from '../components/MyEnAbLogo';
import { Toaster, toast } from 'sonner';
import SEO from '../components/SEO';

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

export default function Onboarding() {
    const { user, updateUser, setToken } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        user_type: user?.user_type || 'individual_disabled',
        location: user?.location || '',
        disability_categories: user?.disability_categories || [],
        onboarding_complete: true
    });

    // If a token is in URL (from SSO), store it
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            setToken(token);
        }
    }, [searchParams, setToken]);

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
            await updateUser(formData);
            toast.success('Profile completed!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-12">
            <SEO title="Complete Your Profile" description="Help us personalize your experience by providing a few more details." />
            <Toaster position="top-center" richColors />

            <div className="w-full max-w-lg">
                <div className="flex justify-center mb-8">
                    <MyEnAbLogo className="w-56 h-14" />
                </div>

                <Card className="bg-[#18181B] border-[#27272A]">
                    <CardHeader>
                        <CardTitle className="font-lexend text-2xl">Complete Your Profile</CardTitle>
                        <CardDescription>
                            Just a few more steps to join our global community
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="user_type" className="text-zinc-200">I am a...</Label>
                                <Select
                                    value={formData.user_type}
                                    onValueChange={(value) => setFormData({ ...formData, user_type: value })}
                                >
                                    <SelectTrigger className="input-dark">
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

                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-zinc-200">Location</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="City, Country"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                    className="input-dark"
                                />
                            </div>

                            {formData.user_type === 'individual_disabled' && (
                                <div className="space-y-3">
                                    <Label className="text-zinc-200">Disability Categories (Optional)</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {disabilityCategories.map(category => (
                                            <div key={category.value} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={category.value}
                                                    checked={formData.disability_categories.includes(category.value)}
                                                    onCheckedChange={() => handleCategoryToggle(category.value)}
                                                    className="border-zinc-600 data-[state=checked]:bg-white data-[state=checked]:border-white"
                                                />
                                                <label htmlFor={category.value} className="text-sm cursor-pointer flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }}></span>
                                                    {category.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button type="submit" className="w-full btn-primary" disabled={loading}>
                                {loading ? 'Saving preferences...' : 'Complete Registration'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
