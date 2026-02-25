import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import SEO from '../components/SEO';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Toaster, toast } from 'sonner';
import { Search, Plus, BookOpen, ExternalLink, Eye, Filter } from 'lucide-react';

import { API_URL as API } from '../config';

const categories = [
    { value: 'guide', label: 'Guides & How-Tos', color: '#FFD700' },
    { value: 'rights', label: 'Rights & Legal', color: '#38BDF8' },
    { value: 'health', label: 'Health & Wellness', color: '#34D399' },
    { value: 'technology', label: 'Technology & Tools', color: '#FF5C5C' },
    { value: 'employment', label: 'Employment', color: '#F4F4F5' },
    { value: 'education', label: 'Education', color: '#FFD700' },
    { value: 'accessibility', label: 'Accessibility', color: '#38BDF8' }
];

export default function Resources() {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newResource, setNewResource] = useState({
        title: '',
        description: '',
        category: 'guide',
        url: '',
        content: '',
        tags: ''
    });

    useEffect(() => {
        fetchResources();
    }, [selectedCategory, searchQuery]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
            if (searchQuery) params.append('search', searchQuery);

            const response = await axios.get(`${API}/resources?${params.toString()}`);
            setResources(response.data);
        } catch (error) {
            console.error('Failed to fetch resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateResource = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to add a resource');
            return;
        }
        setCreating(true);
        try {
            const resourceData = {
                ...newResource,
                tags: newResource.tags.split(',').map(t => t.trim()).filter(Boolean)
            };
            await axios.post(`${API}/resources`, resourceData);
            toast.success('Resource added successfully!');
            setIsCreateOpen(false);
            setNewResource({
                title: '',
                description: '',
                category: 'guide',
                url: '',
                content: '',
                tags: ''
            });
            fetchResources();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to add resource');
        } finally {
            setCreating(false);
        }
    };

    const getCategoryStyle = (cat) => {
        const found = categories.find(c => c.value === cat);
        return found || categories[0];
    };

    return (
        <Layout>
            <SEO
                title="Resources"
                description="Access our library of educational materials, advocacy tools, and guides to help navigate daily challenges."
                keywords="disability resources, advocacy tools, accessibility guides, educational materials"
            />
            <Toaster position="top-center" richColors />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8" data-testid="resources-header">
                    <div>
                        <h1 className="font-lexend text-3xl font-bold mb-2">Resource Library</h1>
                        <p className="text-zinc-400">Guides, articles, and tools to help navigate daily challenges</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="btn-primary" data-testid="add-resource-btn">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Resource
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#18181B] border-[#27272A] max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="font-lexend text-xl">Add New Resource</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateResource} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={newResource.title}
                                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                                        required
                                        className="input-dark"
                                        data-testid="resource-title-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={newResource.category}
                                        onValueChange={(value) => setNewResource({ ...newResource, category: value })}
                                    >
                                        <SelectTrigger className="input-dark" data-testid="resource-category-select">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#18181B] border-[#27272A]">
                                            {categories.map(cat => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                                                        {cat.label}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={newResource.description}
                                        onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                                        required
                                        rows={3}
                                        className="input-dark resize-none"
                                        data-testid="resource-description-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="url">External URL (optional)</Label>
                                    <Input
                                        id="url"
                                        type="url"
                                        value={newResource.url}
                                        onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                                        placeholder="https://"
                                        className="input-dark"
                                        data-testid="resource-url-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="content">Content (optional)</Label>
                                    <Textarea
                                        id="content"
                                        value={newResource.content}
                                        onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
                                        rows={4}
                                        className="input-dark resize-none"
                                        placeholder="Full article or guide content..."
                                        data-testid="resource-content-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags (comma separated)</Label>
                                    <Input
                                        id="tags"
                                        value={newResource.tags}
                                        onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
                                        className="input-dark"
                                        placeholder="e.g., wheelchair, travel, tips"
                                        data-testid="resource-tags-input"
                                    />
                                </div>
                                <Button type="submit" className="w-full btn-primary" disabled={creating} data-testid="submit-resource-btn">
                                    {creating ? 'Adding...' : 'Add Resource'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8" data-testid="resources-filters">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <Input
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-dark pl-10"
                            data-testid="search-resources"
                        />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-56 input-dark" data-testid="filter-category">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#18181B] border-[#27272A]">
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map(cat => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                                        {cat.label}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 mb-8" data-testid="category-pills">
                    {categories.map(cat => (
                        <button
                            key={cat.value}
                            onClick={() => setSelectedCategory(cat.value === selectedCategory ? 'all' : cat.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.value
                                ? 'bg-white text-black'
                                : 'bg-[#18181B] border border-[#27272A] text-zinc-300 hover:border-white/30'
                                }`}
                            data-testid={`category-pill-${cat.value}`}
                        >
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                                {cat.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="resources-grid">
                    {loading ? (
                        <div className="col-span-full text-center py-12 text-zinc-500">Loading resources...</div>
                    ) : resources.length > 0 ? (
                        resources.map((resource) => {
                            const catStyle = getCategoryStyle(resource.category);
                            return (
                                <Card key={resource.id} className="bg-[#18181B] border-[#27272A] hover:border-white/20 transition-colors group" data-testid={`resource-${resource.id}`}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <span
                                                className="px-3 py-1 rounded-full text-xs font-medium"
                                                style={{
                                                    backgroundColor: `${catStyle.color}20`,
                                                    color: catStyle.color
                                                }}
                                            >
                                                {catStyle.label}
                                            </span>
                                            <div className="flex items-center gap-1 text-xs text-zinc-500">
                                                <Eye className="w-3 h-3" />
                                                {resource.views}
                                            </div>
                                        </div>
                                        <h3 className="font-lexend text-lg font-semibold mb-2 group-hover:text-pride-gold transition-colors">
                                            {resource.title}
                                        </h3>
                                        <p className="text-zinc-400 text-sm line-clamp-3 mb-4">{resource.description}</p>

                                        <div className="text-xs text-zinc-500 mb-4">
                                            By {resource.author_name} • {new Date(resource.created_at).toLocaleDateString()}
                                        </div>

                                        {resource.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {resource.tags.slice(0, 3).map(tag => (
                                                    <span key={tag} className="px-2 py-1 bg-[#27272A] rounded text-xs text-zinc-400">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {resource.url && (
                                            <a
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-sm text-pride-blue hover:underline"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                View Resource
                                            </a>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <BookOpen className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                            <h3 className="font-lexend text-xl mb-2">No resources found</h3>
                            <p className="text-zinc-500 mb-4">Be the first to share a helpful resource!</p>
                            <Button onClick={() => setIsCreateOpen(true)} className="btn-primary" data-testid="empty-add-resource-btn">
                                Add Resource
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
