import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import SEO from '../components/SEO';
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
import { PendingRequests } from '../components/PendingRequests';

import { API_URL as API } from '../config';

export default function Dashboard() {
    const { user } = useAuth();
    const [recentPosts, setRecentPosts] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [postsRes, eventsRes] = await Promise.all([
                axios.get(`${API}/forums?limit=5`),
                axios.get(`${API}/events?limit=5&upcoming=true`)
            ]);
            setRecentPosts(postsRes.data);
            setUpcomingEvents(eventsRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const organizingRoles = ['ngo', 'volunteer', 'service_provider'];
    const providerRoles = ['ngo', 'service_provider'];

    const quickLinks = [
        { path: '/forums/new', label: 'Start Discussion', icon: MessageSquare, color: '#38BDF8', show: true },
        { 
            path: '/events', 
            label: 'Create Event', 
            icon: Calendar, 
            color: '#34D399', 
            show: organizingRoles.includes(user?.user_type) 
        },
        { 
            path: '/directory', 
            label: 'Register Provider', 
            icon: Building2, 
            color: '#FFD700', 
            show: providerRoles.includes(user?.user_type) 
        },
        { path: '/resources', label: 'Browse Resources', icon: BookOpen, color: '#FF5C5C', show: true }
    ].filter(link => link.show);

    return (
        <Layout>
            <SEO
                title="Dashboard"
                description="Your personalized overview of community activity, forums, and upcoming events."
            />
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

                <PendingRequests />

                {/* Quick Actions */}
                {quickLinks.length > 0 && (
                    <div className="mb-8" data-testid="quick-links">
                        <h2 className="font-lexend text-xl font-semibold mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                )}


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
                                        <Button variant="link" className="text-inclusion-gold mt-2">
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
                                                    <div className="w-12 h-12 rounded-lg bg-inclusion-blue/20 flex flex-col items-center justify-center flex-shrink-0">
                                                        <span className="text-xs text-inclusion-blue font-medium">
                                                            {new Date(event.start_date).toLocaleDateString('en', { month: 'short' })}
                                                        </span>
                                                        <span className="text-lg font-bold text-inclusion-blue">
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
                                        {['ngo', 'volunteer', 'service_provider'].includes(user?.user_type) && (
                                            <Button variant="link" className="text-inclusion-blue mt-2" data-testid="empty-create-event-btn">
                                                Create an event
                                            </Button>
                                        )}
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
