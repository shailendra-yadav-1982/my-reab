import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { DisabilityBadge } from '../components/DisabilityBadge';
import { Toaster, toast } from 'sonner';
import { User, MapPin, Mail, Calendar, Save } from 'lucide-react';

const disabilityCategories = [
    { value: 'physical', label: 'Physical', color: '#FF5C5C' },
    { value: 'cognitive', label: 'Cognitive / Neurodivergent', color: '#FFD700' },
    { value: 'invisible', label: 'Invisible / Undiagnosed', color: '#F4F4F5' },
    { value: 'psychiatric', label: 'Psychiatric / Emotional', color: '#38BDF8' },
    { value: 'sensory', label: 'Sensory', color: '#34D399' }
];

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        location: user?.location || '',
        disability_categories: user?.disability_categories || []
    });

    const handleCategoryToggle = (category) => {
        setFormData(prev => ({
            ...prev,
            disability_categories: prev.disability_categories.includes(category)
                ? prev.disability_categories.filter(c => c !== category)
                : [...prev.disability_categories, category]
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateUser(formData);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const getUserTypeLabel = (type) => {
        const labels = {
            individual: 'Individual Member',
            service_provider: 'Service Provider',
            ngo: 'NGO / Non-Profit',
            caregiver: 'Caregiver / Family Member'
        };
        return labels[type] || type;
    };

    return (
        <Layout>
            <Toaster position="top-center" richColors />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <Card className="bg-[#18181B] border-[#27272A] mb-8 overflow-hidden" data-testid="profile-header">
                    <div className="h-32 pride-gradient-bg relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-pride-red via-pride-gold to-pride-green flex items-center justify-center border-4 border-[#18181B]">
                                <span className="text-3xl font-bold text-black">{user?.name?.charAt(0).toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                    <CardContent className="pt-16 pb-6 px-8">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <h1 className="font-lexend text-2xl font-bold mb-1">{user?.name}</h1>
                                <p className="text-zinc-400 text-sm">{getUserTypeLabel(user?.user_type)}</p>
                                {user?.organization_name && (
                                    <p className="text-zinc-300 text-sm mt-1">{user.organization_name}</p>
                                )}
                            </div>
                            <Button
                                onClick={() => setIsEditing(!isEditing)}
                                variant="outline"
                                className="btn-secondary"
                                data-testid="edit-profile-btn"
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-zinc-400">
                            {user?.email && (
                                <span className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </span>
                            )}
                            {user?.location && (
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {user.location}
                                </span>
                            )}
                            {user?.created_at && (
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Joined {new Date(user.created_at).toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                                </span>
                            )}
                        </div>

                        {user?.disability_categories?.length > 0 && !isEditing && (
                            <div className="flex flex-wrap gap-2 mt-6">
                                {user.disability_categories.map(cat => (
                                    <DisabilityBadge key={cat} category={cat} />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Form */}
                {isEditing ? (
                    <Card className="bg-[#18181B] border-[#27272A]" data-testid="edit-profile-form">
                        <CardHeader>
                            <CardTitle className="font-lexend">Edit Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-dark"
                                    data-testid="profile-name-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="City, Country"
                                    className="input-dark"
                                    data-testid="profile-location-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                    className="input-dark resize-none"
                                    data-testid="profile-bio-input"
                                />
                            </div>
                            {user?.user_type === 'individual' && (
                                <div className="space-y-3">
                                    <Label>Disability Categories</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {disabilityCategories.map(category => (
                                            <div key={category.value} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`cat-${category.value}`}
                                                    checked={formData.disability_categories.includes(category.value)}
                                                    onCheckedChange={() => handleCategoryToggle(category.value)}
                                                    className="border-zinc-600 data-[state=checked]:bg-white data-[state=checked]:border-white"
                                                    data-testid={`profile-category-${category.value}`}
                                                />
                                                <label
                                                    htmlFor={`cat-${category.value}`}
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
                            <Button onClick={handleSave} disabled={saving} className="btn-primary" data-testid="save-profile-btn">
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    /* Profile Details */
                    <Card className="bg-[#18181B] border-[#27272A]" data-testid="profile-details">
                        <CardHeader>
                            <CardTitle className="font-lexend">About</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user?.bio ? (
                                <p className="text-zinc-300 leading-relaxed">{user.bio}</p>
                            ) : (
                                <p className="text-zinc-500 italic">No bio added yet. Click "Edit Profile" to add one.</p>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </Layout>
    );
}
