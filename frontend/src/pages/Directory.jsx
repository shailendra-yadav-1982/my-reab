import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Checkbox } from '../components/ui/checkbox';
import { Toaster, toast } from 'sonner';
import { DisabilityBadge } from '../components/DisabilityBadge';
import { Search, Plus, MapPin, Globe, Mail, Phone, Star, Filter, Building2 } from 'lucide-react';

import { API_URL as API } from '../config';

const serviceTypes = [
    'Healthcare', 'Therapy', 'Rehabilitation', 'Education', 'Employment',
    'Housing', 'Transportation', 'Legal Aid', 'Counseling', 'Support Groups',
    'Assistive Technology', 'Recreation', 'Advocacy'
];

const disabilityFocusOptions = [
    { value: 'physical', label: 'Physical Disabilities', color: '#FF5C5C' },
    { value: 'cognitive', label: 'Cognitive/Neurodivergent', color: '#FFD700' },
    { value: 'invisible', label: 'Invisible Disabilities', color: '#F4F4F5' },
    { value: 'psychiatric', label: 'Psychiatric/Emotional', color: '#38BDF8' },
    { value: 'sensory', label: 'Sensory Disabilities', color: '#34D399' }
];

export default function Directory() {
    const { user } = useAuth();
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedService, setSelectedService] = useState('all');
    const [selectedFocus, setSelectedFocus] = useState('all');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newProvider, setNewProvider] = useState({
        name: '',
        description: '',
        services: [],
        disability_focus: [],
        location: '',
        website: '',
        email: '',
        phone: ''
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchProviders();
    }, [selectedService, selectedFocus, searchQuery]);

    const fetchProviders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedService && selectedService !== 'all') params.append('service', selectedService);
            if (selectedFocus && selectedFocus !== 'all') params.append('disability_focus', selectedFocus);
            if (searchQuery) params.append('search', searchQuery);

            const response = await axios.get(`${API}/providers?${params.toString()}`);
            setProviders(response.data);
        } catch (error) {
            console.error('Failed to fetch providers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleServiceToggle = (service) => {
        setNewProvider(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };

    const handleFocusToggle = (focus) => {
        setNewProvider(prev => ({
            ...prev,
            disability_focus: prev.disability_focus.includes(focus)
                ? prev.disability_focus.filter(f => f !== focus)
                : [...prev.disability_focus, focus]
        }));
    };

    const handleCreateProvider = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to register a provider');
            return;
        }
        if (newProvider.services.length === 0) {
            toast.error('Please select at least one service');
            return;
        }
        setCreating(true);
        try {
            await axios.post(`${API}/providers`, newProvider);
            toast.success('Provider registered successfully!');
            setIsCreateOpen(false);
            setNewProvider({
                name: '',
                description: '',
                services: [],
                disability_focus: [],
                location: '',
                website: '',
                email: '',
                phone: ''
            });
            fetchProviders();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to register provider');
        } finally {
            setCreating(false);
        }
    };

    return (
        <Layout>
            <Toaster position="top-center" richColors />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8" data-testid="directory-header">
                    <div>
                        <h1 className="font-lexend text-3xl font-bold mb-2">Service Directory</h1>
                        <p className="text-zinc-400">Find trusted service providers, NGOs, and support organizations</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="btn-primary" data-testid="register-provider-btn">
                                <Plus className="w-4 h-4 mr-2" />
                                Register Provider
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#18181B] border-[#27272A] max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="font-lexend text-xl">Register Service Provider</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateProvider} className="space-y-4 mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Organization Name *</Label>
                                        <Input
                                            id="name"
                                            value={newProvider.name}
                                            onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                                            required
                                            className="input-dark"
                                            data-testid="provider-name-input"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location *</Label>
                                        <Input
                                            id="location"
                                            value={newProvider.location}
                                            onChange={(e) => setNewProvider({ ...newProvider, location: e.target.value })}
                                            required
                                            placeholder="City, Country"
                                            className="input-dark"
                                            data-testid="provider-location-input"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={newProvider.description}
                                        onChange={(e) => setNewProvider({ ...newProvider, description: e.target.value })}
                                        required
                                        rows={4}
                                        className="input-dark resize-none"
                                        placeholder="Describe your organization and services..."
                                        data-testid="provider-description-input"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label>Services Offered *</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {serviceTypes.map(service => (
                                            <div key={service} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`service-${service}`}
                                                    checked={newProvider.services.includes(service)}
                                                    onCheckedChange={() => handleServiceToggle(service)}
                                                    className="border-zinc-600"
                                                    data-testid={`service-${service.toLowerCase()}`}
                                                />
                                                <label htmlFor={`service-${service}`} className="text-sm cursor-pointer">
                                                    {service}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label>Disability Focus</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {disabilityFocusOptions.map(option => (
                                            <div key={option.value} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`focus-${option.value}`}
                                                    checked={newProvider.disability_focus.includes(option.value)}
                                                    onCheckedChange={() => handleFocusToggle(option.value)}
                                                    className="border-zinc-600"
                                                    data-testid={`focus-${option.value}`}
                                                />
                                                <label htmlFor={`focus-${option.value}`} className="text-sm cursor-pointer flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: option.color }}></span>
                                                    {option.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            value={newProvider.website}
                                            onChange={(e) => setNewProvider({ ...newProvider, website: e.target.value })}
                                            placeholder="https://"
                                            className="input-dark"
                                            data-testid="provider-website-input"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={newProvider.email}
                                            onChange={(e) => setNewProvider({ ...newProvider, email: e.target.value })}
                                            className="input-dark"
                                            data-testid="provider-email-input"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={newProvider.phone}
                                            onChange={(e) => setNewProvider({ ...newProvider, phone: e.target.value })}
                                            className="input-dark"
                                            data-testid="provider-phone-input"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full btn-primary" disabled={creating} data-testid="submit-provider-btn">
                                    {creating ? 'Registering...' : 'Register Provider'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" data-testid="directory-filters">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <Input
                            placeholder="Search providers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-dark pl-10"
                            data-testid="search-providers"
                        />
                    </div>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger className="input-dark" data-testid="filter-service">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="All Services" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#18181B] border-[#27272A]">
                            <SelectItem value="all">All Services</SelectItem>
                            {serviceTypes.map(service => (
                                <SelectItem key={service} value={service}>{service}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedFocus} onValueChange={setSelectedFocus}>
                        <SelectTrigger className="input-dark" data-testid="filter-focus">
                            <SelectValue placeholder="All Disabilities" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#18181B] border-[#27272A]">
                            <SelectItem value="all">All Disabilities</SelectItem>
                            {disabilityFocusOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: option.color }}></span>
                                        {option.label}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Providers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="providers-grid">
                    {loading ? (
                        <div className="col-span-full text-center py-12 text-zinc-500">Loading providers...</div>
                    ) : providers.length > 0 ? (
                        providers.map((provider) => (
                            <Card key={provider.id} className="bg-[#18181B] border-[#27272A] hover:border-white/20 transition-colors" data-testid={`provider-${provider.id}`}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-pride-blue/20 flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-pride-blue" />
                                        </div>
                                        {provider.is_verified && (
                                            <span className="px-2 py-1 bg-pride-green/20 text-pride-green text-xs rounded-full">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-lexend text-lg font-semibold mb-2">{provider.name}</h3>
                                    <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{provider.description}</p>

                                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
                                        <MapPin className="w-4 h-4" />
                                        {provider.location}
                                    </div>

                                    {provider.disability_focus?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {provider.disability_focus.map(focus => (
                                                <DisabilityBadge key={focus} category={focus} size="small" />
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {provider.services?.slice(0, 3).map(service => (
                                            <span key={service} className="px-2 py-1 bg-[#27272A] rounded text-xs text-zinc-300">
                                                {service}
                                            </span>
                                        ))}
                                        {provider.services?.length > 3 && (
                                            <span className="px-2 py-1 bg-[#27272A] rounded text-xs text-zinc-500">
                                                +{provider.services.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 pt-4 border-t border-[#27272A]">
                                        {provider.website && (
                                            <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white">
                                                <Globe className="w-4 h-4" />
                                            </a>
                                        )}
                                        {provider.email && (
                                            <a href={`mailto:${provider.email}`} className="text-zinc-400 hover:text-white">
                                                <Mail className="w-4 h-4" />
                                            </a>
                                        )}
                                        {provider.phone && (
                                            <a href={`tel:${provider.phone}`} className="text-zinc-400 hover:text-white">
                                                <Phone className="w-4 h-4" />
                                            </a>
                                        )}
                                        {provider.rating > 0 && (
                                            <span className="flex items-center gap-1 text-sm text-pride-gold ml-auto">
                                                <Star className="w-4 h-4 fill-current" />
                                                {provider.rating.toFixed(1)}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <Building2 className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                            <h3 className="font-lexend text-xl mb-2">No providers found</h3>
                            <p className="text-zinc-500 mb-4">Try adjusting your filters or be the first to register!</p>
                            <Button onClick={() => setIsCreateOpen(true)} className="btn-primary" data-testid="empty-register-btn">
                                Register Provider
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
