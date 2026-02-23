import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout } from '../components/Layout';
import SEO from '../components/SEO';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DisabilityBadge } from '../components/DisabilityBadge';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, MessageSquare, Filter } from 'lucide-react';

import { API_URL as API } from '../config';

const userTypes = [
    { value: 'all', label: 'All Members' },
    { value: 'individual', label: 'Individuals' },
    { value: 'service_provider', label: 'Service Providers' },
    { value: 'ngo', label: 'NGOs' },
    { value: 'caregiver', label: 'Caregivers' }
];

const disabilityCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'physical', label: 'Physical', color: '#FF5C5C' },
    { value: 'cognitive', label: 'Cognitive', color: '#FFD700' },
    { value: 'invisible', label: 'Invisible', color: '#F4F4F5' },
    { value: 'psychiatric', label: 'Psychiatric', color: '#38BDF8' },
    { value: 'sensory', label: 'Sensory', color: '#34D399' }
];

export default function Community() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetchMembers();
    }, [selectedType, selectedCategory]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedType && selectedType !== 'all') params.append('user_type', selectedType);
            if (selectedCategory && selectedCategory !== 'all') params.append('disability_category', selectedCategory);

            const response = await axios.get(`${API}/users?${params.toString()}`);
            setMembers(response.data);
        } catch (error) {
            console.error('Failed to fetch members:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getUserTypeLabel = (type) => {
        const found = userTypes.find(t => t.value === type);
        return found?.label || type;
    };

    return (
        <Layout>
            <SEO
                title="Community"
                description="Meet and connect with members of our inclusive global community. Build meaningful relationships and share support."
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8" data-testid="community-header">
                    <h1 className="font-lexend text-3xl font-bold mb-2">Community Members</h1>
                    <p className="text-zinc-400">Connect with others in the disability community worldwide</p>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" data-testid="community-filters">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <Input
                            placeholder="Search by name or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-dark pl-10"
                            data-testid="search-members"
                        />
                    </div>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="input-dark" data-testid="filter-type">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="All Members" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#18181B] border-[#27272A]">
                            {userTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="input-dark" data-testid="filter-category">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#18181B] border-[#27272A]">
                            {disabilityCategories.map(cat => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    {cat.color ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                                            {cat.label}
                                        </span>
                                    ) : cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Members Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="members-grid">
                    {loading ? (
                        <div className="col-span-full text-center py-12 text-zinc-500">Loading members...</div>
                    ) : filteredMembers.length > 0 ? (
                        filteredMembers.map((member) => (
                            <Card key={member.id} className="bg-[#18181B] border-[#27272A] hover:border-white/20 transition-colors" data-testid={`member-${member.id}`}>
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pride-red via-pride-gold to-pride-green flex items-center justify-center mb-4">
                                        <span className="text-xl font-bold text-black">{member.name?.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <h3 className="font-lexend font-semibold mb-1">{member.name}</h3>
                                    <p className="text-xs text-zinc-500 mb-3">{getUserTypeLabel(member.user_type)}</p>

                                    {member.location && (
                                        <div className="flex items-center justify-center gap-1 text-sm text-zinc-400 mb-3">
                                            <MapPin className="w-3 h-3" />
                                            {member.location}
                                        </div>
                                    )}

                                    {member.disability_categories?.length > 0 && (
                                        <div className="flex flex-wrap justify-center gap-1 mb-4">
                                            {member.disability_categories.slice(0, 2).map(cat => (
                                                <DisabilityBadge key={cat} category={cat} size="small" />
                                            ))}
                                            {member.disability_categories.length > 2 && (
                                                <span className="px-2 py-0.5 bg-[#27272A] rounded-full text-xs text-zinc-500">
                                                    +{member.disability_categories.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {member.bio && (
                                        <p className="text-xs text-zinc-400 line-clamp-2 mb-4">{member.bio}</p>
                                    )}

                                    <Link to={`/messages`}>
                                        <Button variant="outline" size="sm" className="w-full btn-secondary py-2" data-testid={`message-btn-${member.id}`}>
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Message
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <Users className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                            <h3 className="font-lexend text-xl mb-2">No members found</h3>
                            <p className="text-zinc-500">Try adjusting your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
