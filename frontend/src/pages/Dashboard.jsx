import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { DisabilityBadge } from '../components/DisabilityBadge';
import {
    Users,
    MessageSquare,
    Calendar,
    Building2,
    BookOpen,
    ArrowRight,
    TrendingUp,
    Clock
} from 'lucide-react';

import { API_URL as API } from '../config';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ users: 0, providers: 0, events: 0, posts: 0, resources: 0 });
    const [recentPosts, setRecentPosts] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, postsRes, eventsRes] = await Promise.all([
                axios.get(`${API}/stats`),
                axios.get(`${API}/forums?limit=5`),
                axios.get(`${API}/events?limit=5&upcoming=true`)
            ]);
            setStats(statsRes.data);
            setRecentPosts(postsRes.data);
            setUpcomingEvents(eventsRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickLinks = [
        { path: '/forums', label: 'Browse Forums', icon: MessageSquare, color: '#FFD700' },
        { path: '/directory', label: 'Find Services', icon: Building2, color: '#38BDF8' },
        { path: '/events', label: 'View Events', icon: Calendar, color: '#34D399' },
        { path: '/resources', label: 'Resources', icon: BookOpen, color: '#FF5C5C' },
        { path: '/community', label: 'Community', icon: Users, color: '#F4F4F5' }
    ];

    const statCards = [
        { label: 'Community Members', value: stats.users, icon: Users, color: '#FF5C5C' },
        { label: 'Service Providers', value: stats.providers, icon: Building2, color: '#FFD700' },
        { label: 'Upcoming Events', value: stats.events, icon: Calendar, color: '#38BDF8' },
        { label: 'Forum Discussions', value: stats.posts, icon: MessageSquare, color: '#34D399' }
    ];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8" data-testid="welcome-section">
                    <h1 className="font-lexend text-3xl md:text-4xl font-bold mb-2">
                        Welcome back, {user?.name?.split(' ')[0]}!
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Here's what's happening in your community today.
                    </p>
                    {user?.disability_categories?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {user.disability_categories.map(cat => (
                                <DisabilityBadge key={cat} category={cat} size="small" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" data-testid="stats-grid">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.label} className="bg-[#18181B] border-[#27272A]" data-testid={`stat-card-${index}`}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: `${stat.color}20` }}
                                        >
                                            <Icon className="w-5 h-5" style={{ color: stat.color }} />
                                        </div>
                                        <TrendingUp className="w-4 h-4 text-pride-green" />
                                    </div>
                                    <div className="font-lexend text-2xl font-bold">{stat.value}</div>
                                    <div className="text-zinc-400 text-sm">{stat.label}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Quick Links */}
                <div className="mb-8" data-testid="quick-links">
                    <h2 className="font-lexend text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {quickLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link key={link.path} to={link.path}>
                                    <Card className="bg-[#18181B] border-[#27272A] hover:border-white/20 transition-all cursor-pointer group" data-testid={`quick-link-${link.label.toLowerCase().replace(' ', '-')}`}>
                                        <CardContent className="p-4 text-center">
                                            <div
                                                className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110"
                                                style={{ backgroundColor: `${link.color}20` }}
                                            >
                                                <Icon className="w-6 h-6" style={{ color: link.color }} />
                                            </div>
                                            <span className="text-sm font-medium">{link.label}</span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Forum Posts */}
                    <Card className="bg-[#18181B] border-[#27272A]" data-testid="recent-posts">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="font-lexend text-lg">Recent Discussions</CardTitle>
                            <Link to="/forums">
                                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                                    View all
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recentPosts.length > 0 ? (
                                <div className="space-y-4">
                                    {recentPosts.map((post) => (
                                        <Link key={post.id} to={`/forums/${post.id}`}>
                                            <div className="p-4 rounded-lg bg-[#121212] border border-[#27272A] hover:border-white/20 transition-colors">
                                                <h3 className="font-medium mb-1 line-clamp-1">{post.title}</h3>
                                                <p className="text-sm text-zinc-400 line-clamp-2 mb-2">{post.content}</p>
                                                <div className="flex items-center gap-4 text-xs text-zinc-500">
                                                    <span>{post.author_name}</span>
                                                    <span>{post.comments_count} comments</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-zinc-500">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No discussions yet</p>
                                    <Link to="/forums">
                                        <Button variant="link" className="text-pride-gold mt-2">
                                            Start a conversation
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Events */}
                    <Card className="bg-[#18181B] border-[#27272A]" data-testid="upcoming-events">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="font-lexend text-lg">Upcoming Events</CardTitle>
                            <Link to="/events">
                                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                                    View all
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {upcomingEvents.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingEvents.map((event) => (
                                        <Link key={event.id} to={`/events/${event.id}`}>
                                            <div className="p-4 rounded-lg bg-[#121212] border border-[#27272A] hover:border-white/20 transition-colors">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-pride-blue/20 flex flex-col items-center justify-center flex-shrink-0">
                                                        <span className="text-xs text-pride-blue font-medium">
                                                            {new Date(event.start_date).toLocaleDateString('en', { month: 'short' })}
                                                        </span>
                                                        <span className="text-lg font-bold text-pride-blue">
                                                            {new Date(event.start_date).getDate()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium mb-1 line-clamp-1">{event.title}</h3>
                                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{event.is_virtual ? 'Virtual Event' : event.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-zinc-500">
                                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No upcoming events</p>
                                    <Link to="/events">
                                        <Button variant="link" className="text-pride-blue mt-2">
                                            Create an event
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
