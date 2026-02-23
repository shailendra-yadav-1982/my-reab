import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { Toaster, toast } from 'sonner';
import { Search, Plus, MessageSquare, Heart, Clock, Filter } from 'lucide-react';

import { API_URL as API } from '../config';

const categories = [
    { value: 'general', label: 'General Discussion', color: '#F4F4F5' },
    { value: 'support', label: 'Support & Advice', color: '#FF5C5C' },
    { value: 'accessibility', label: 'Accessibility', color: '#FFD700' },
    { value: 'employment', label: 'Employment', color: '#38BDF8' },
    { value: 'healthcare', label: 'Healthcare', color: '#34D399' },
    { value: 'relationships', label: 'Relationships', color: '#FF5C5C' },
    { value: 'technology', label: 'Technology & Tools', color: '#FFD700' },
    { value: 'advocacy', label: 'Advocacy & Rights', color: '#38BDF8' }
];

export default function Forums() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general', tags: '' });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [selectedCategory, searchQuery]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
            if (searchQuery) params.append('search', searchQuery);

            const response = await axios.get(`${API}/forums?${params.toString()}`);
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to create a post');
            return;
        }
        setCreating(true);
        try {
            const postData = {
                ...newPost,
                tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean)
            };
            await axios.post(`${API}/forums`, postData);
            toast.success('Post created successfully!');
            setIsCreateOpen(false);
            setNewPost({ title: '', content: '', category: 'general', tags: '' });
            fetchPosts();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to create post');
        } finally {
            setCreating(false);
        }
    };

    const handleLike = async (postId) => {
        if (!user) {
            toast.error('Please login to like posts');
            return;
        }
        try {
            const response = await axios.post(`${API}/forums/${postId}/like`);
            setPosts(posts.map(p =>
                p.id === postId
                    ? { ...p, likes: response.data.liked ? p.likes + 1 : p.likes - 1 }
                    : p
            ));
        } catch (error) {
            toast.error('Failed to like post');
        }
    };

    const getCategoryColor = (cat) => {
        const found = categories.find(c => c.value === cat);
        return found?.color || '#F4F4F5';
    };

    return (
        <Layout>
            <Toaster position="top-center" richColors />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8" data-testid="forums-header">
                    <div>
                        <h1 className="font-lexend text-3xl font-bold mb-2">Community Forums</h1>
                        <p className="text-zinc-400">Share experiences, ask questions, and connect with others</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="btn-primary" data-testid="create-post-btn">
                                <Plus className="w-4 h-4 mr-2" />
                                New Post
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#18181B] border-[#27272A] max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="font-lexend text-xl">Create New Post</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreatePost} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={newPost.title}
                                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                        required
                                        className="input-dark"
                                        placeholder="What's on your mind?"
                                        data-testid="post-title-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={newPost.category}
                                        onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                                    >
                                        <SelectTrigger className="input-dark" data-testid="post-category-select">
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
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        value={newPost.content}
                                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                        required
                                        rows={6}
                                        className="input-dark resize-none"
                                        placeholder="Share your thoughts..."
                                        data-testid="post-content-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags (comma separated)</Label>
                                    <Input
                                        id="tags"
                                        value={newPost.tags}
                                        onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                                        className="input-dark"
                                        placeholder="e.g., wheelchair, accessibility, tips"
                                        data-testid="post-tags-input"
                                    />
                                </div>
                                <Button type="submit" className="w-full btn-primary" disabled={creating} data-testid="submit-post-btn">
                                    {creating ? 'Creating...' : 'Create Post'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8" data-testid="forums-filters">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <Input
                            placeholder="Search discussions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-dark pl-10"
                            data-testid="search-input"
                        />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-48 input-dark" data-testid="filter-category">
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

                {/* Posts List */}
                <div className="space-y-4" data-testid="posts-list">
                    {loading ? (
                        <div className="text-center py-12 text-zinc-500">Loading discussions...</div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <Card key={post.id} className="bg-[#18181B] border-[#27272A] hover:border-white/20 transition-colors" data-testid={`post-${post.id}`}>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span
                                                    className="px-3 py-1 rounded-full text-xs font-medium"
                                                    style={{
                                                        backgroundColor: `${getCategoryColor(post.category)}20`,
                                                        color: getCategoryColor(post.category)
                                                    }}
                                                >
                                                    {categories.find(c => c.value === post.category)?.label || post.category}
                                                </span>
                                            </div>
                                            <Link to={`/forums/${post.id}`}>
                                                <h2 className="font-lexend text-xl font-semibold mb-2 hover:text-pride-gold transition-colors">
                                                    {post.title}
                                                </h2>
                                            </Link>
                                            <p className="text-zinc-400 line-clamp-2 mb-4">{post.content}</p>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                                                <span className="text-zinc-300">{post.author_name}</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(post.created_at).toLocaleDateString()}
                                                </span>
                                                <button
                                                    onClick={() => handleLike(post.id)}
                                                    className="flex items-center gap-1 hover:text-pride-red transition-colors"
                                                    data-testid={`like-btn-${post.id}`}
                                                >
                                                    <Heart className="w-4 h-4" />
                                                    {post.likes}
                                                </button>
                                                <Link to={`/forums/${post.id}`} className="flex items-center gap-1 hover:text-white transition-colors">
                                                    <MessageSquare className="w-4 h-4" />
                                                    {post.comments_count} comments
                                                </Link>
                                            </div>
                                            {post.tags?.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {post.tags.map(tag => (
                                                        <span key={tag} className="px-2 py-1 text-xs bg-[#27272A] rounded text-zinc-400">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                            <h3 className="font-lexend text-xl mb-2">No discussions found</h3>
                            <p className="text-zinc-500 mb-4">Be the first to start a conversation!</p>
                            <Button onClick={() => setIsCreateOpen(true)} className="btn-primary" data-testid="empty-create-post-btn">
                                Create Post
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
