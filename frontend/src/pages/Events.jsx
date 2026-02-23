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
import { Switch } from '../components/ui/switch';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Toaster, toast } from 'sonner';
import { Search, Plus, MapPin, Calendar as CalendarIcon, Clock, Users, Video, Filter } from 'lucide-react';
import { format } from 'date-fns';

import { API_URL as API } from '../config';

const eventTypes = [
    { value: 'workshop', label: 'Workshop' },
    { value: 'support_group', label: 'Support Group' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'conference', label: 'Conference' },
    { value: 'social', label: 'Social Meetup' },
    { value: 'training', label: 'Training' },
    { value: 'advocacy', label: 'Advocacy Event' }
];

const accessibilityFeatures = [
    'Sign Language Interpreter',
    'Closed Captions',
    'Wheelchair Accessible',
    'Audio Description',
    'Large Print Materials',
    'Quiet Space Available',
    'Service Animals Welcome'
];

export default function Events() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [showVirtualOnly, setShowVirtualOnly] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        event_type: 'workshop',
        location: '',
        is_virtual: false,
        virtual_link: '',
        start_date: '',
        accessibility_features: []
    });

    useEffect(() => {
        fetchEvents();
    }, [selectedType, showVirtualOnly, searchQuery]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedType && selectedType !== 'all') params.append('event_type', selectedType);
            if (showVirtualOnly) params.append('is_virtual', 'true');
            params.append('upcoming', 'true');

            const response = await axios.get(`${API}/events?${params.toString()}`);
            setEvents(response.data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFeatureToggle = (feature) => {
        setNewEvent(prev => ({
            ...prev,
            accessibility_features: prev.accessibility_features.includes(feature)
                ? prev.accessibility_features.filter(f => f !== feature)
                : [...prev.accessibility_features, feature]
        }));
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to create an event');
            return;
        }
        if (!startDate) {
            toast.error('Please select a start date');
            return;
        }
        setCreating(true);
        try {
            const eventData = {
                ...newEvent,
                start_date: startDate.toISOString()
            };
            await axios.post(`${API}/events`, eventData);
            toast.success('Event created successfully!');
            setIsCreateOpen(false);
            setNewEvent({
                title: '',
                description: '',
                event_type: 'workshop',
                location: '',
                is_virtual: false,
                virtual_link: '',
                start_date: '',
                accessibility_features: []
            });
            setStartDate(null);
            fetchEvents();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to create event');
        } finally {
            setCreating(false);
        }
    };

    const handleAttend = async (eventId) => {
        if (!user) {
            toast.error('Please login to attend events');
            return;
        }
        try {
            const response = await axios.post(`${API}/events/${eventId}/attend`);
            setEvents(events.map(e =>
                e.id === eventId
                    ? { ...e, attendees_count: response.data.attending ? e.attendees_count + 1 : e.attendees_count - 1 }
                    : e
            ));
            toast.success(response.data.attending ? 'You\'re attending!' : 'Removed from event');
        } catch (error) {
            toast.error('Failed to update attendance');
        }
    };

    return (
        <Layout>
            <Toaster position="top-center" richColors />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8" data-testid="events-header">
                    <div>
                        <h1 className="font-lexend text-3xl font-bold mb-2">Events & Meetups</h1>
                        <p className="text-zinc-400">Discover accessible events from the disability community</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="btn-primary" data-testid="create-event-btn">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#18181B] border-[#27272A] max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="font-lexend text-xl">Create New Event</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateEvent} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Event Title *</Label>
                                    <Input
                                        id="title"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        required
                                        className="input-dark"
                                        data-testid="event-title-input"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Event Type</Label>
                                        <Select
                                            value={newEvent.event_type}
                                            onValueChange={(value) => setNewEvent({ ...newEvent, event_type: value })}
                                        >
                                            <SelectTrigger className="input-dark" data-testid="event-type-select">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#18181B] border-[#27272A]">
                                                {eventTypes.map(type => (
                                                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date & Time *</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full input-dark justify-start text-left font-normal" data-testid="event-date-picker">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-[#18181B] border-[#27272A]">
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={setStartDate}
                                                    disabled={(date) => date < new Date()}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        required
                                        rows={4}
                                        className="input-dark resize-none"
                                        data-testid="event-description-input"
                                    />
                                </div>
                                <div className="flex items-center space-x-4 p-4 bg-[#121212] rounded-lg">
                                    <Switch
                                        id="is_virtual"
                                        checked={newEvent.is_virtual}
                                        onCheckedChange={(checked) => setNewEvent({ ...newEvent, is_virtual: checked })}
                                        data-testid="event-virtual-switch"
                                    />
                                    <Label htmlFor="is_virtual" className="flex items-center gap-2 cursor-pointer">
                                        <Video className="w-4 h-4" />
                                        This is a virtual event
                                    </Label>
                                </div>
                                {newEvent.is_virtual ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="virtual_link">Virtual Meeting Link</Label>
                                        <Input
                                            id="virtual_link"
                                            value={newEvent.virtual_link}
                                            onChange={(e) => setNewEvent({ ...newEvent, virtual_link: e.target.value })}
                                            placeholder="https://zoom.us/..."
                                            className="input-dark"
                                            data-testid="event-virtual-link"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location *</Label>
                                        <Input
                                            id="location"
                                            value={newEvent.location}
                                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                            required={!newEvent.is_virtual}
                                            placeholder="Venue address"
                                            className="input-dark"
                                            data-testid="event-location-input"
                                        />
                                    </div>
                                )}
                                <div className="space-y-3">
                                    <Label>Accessibility Features</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {accessibilityFeatures.map(feature => (
                                            <button
                                                key={feature}
                                                type="button"
                                                onClick={() => handleFeatureToggle(feature)}
                                                className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${newEvent.accessibility_features.includes(feature)
                                                        ? 'bg-pride-green/20 text-pride-green border border-pride-green/30'
                                                        : 'bg-[#27272A] text-zinc-300 border border-transparent hover:border-white/20'
                                                    }`}
                                                data-testid={`accessibility-${feature.toLowerCase().replace(/ /g, '-')}`}
                                            >
                                                {feature}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Button type="submit" className="w-full btn-primary" disabled={creating} data-testid="submit-event-btn">
                                    {creating ? 'Creating...' : 'Create Event'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8" data-testid="events-filters">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <Input
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-dark pl-10"
                            data-testid="search-events"
                        />
                    </div>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-full sm:w-48 input-dark" data-testid="filter-type">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#18181B] border-[#27272A]">
                            <SelectItem value="all">All Types</SelectItem>
                            {eventTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-[#18181B] rounded-lg border border-[#27272A]">
                        <Switch
                            id="virtual-only"
                            checked={showVirtualOnly}
                            onCheckedChange={setShowVirtualOnly}
                            data-testid="virtual-only-switch"
                        />
                        <Label htmlFor="virtual-only" className="text-sm cursor-pointer">Virtual Only</Label>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="events-grid">
                    {loading ? (
                        <div className="col-span-full text-center py-12 text-zinc-500">Loading events...</div>
                    ) : events.length > 0 ? (
                        events.map((event) => (
                            <Card key={event.id} className="bg-[#18181B] border-[#27272A] hover:border-white/20 transition-colors overflow-hidden" data-testid={`event-${event.id}`}>
                                <div className={`h-2 ${event.is_virtual ? 'bg-pride-blue' : 'bg-pride-green'}`}></div>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-14 h-14 rounded-xl bg-pride-blue/20 flex flex-col items-center justify-center">
                                            <span className="text-xs text-pride-blue font-medium">
                                                {new Date(event.start_date).toLocaleDateString('en', { month: 'short' })}
                                            </span>
                                            <span className="text-xl font-bold text-pride-blue">
                                                {new Date(event.start_date).getDate()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="px-2 py-1 bg-[#27272A] rounded text-xs text-zinc-300">
                                                {eventTypes.find(t => t.value === event.event_type)?.label || event.event_type}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="font-lexend text-lg font-semibold mb-2">{event.title}</h3>
                                    <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{event.description}</p>

                                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                                        {event.is_virtual ? (
                                            <>
                                                <Video className="w-4 h-4 text-pride-blue" />
                                                <span>Virtual Event</span>
                                            </>
                                        ) : (
                                            <>
                                                <MapPin className="w-4 h-4" />
                                                <span>{event.location}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
                                        <Users className="w-4 h-4" />
                                        <span>{event.attendees_count} attending</span>
                                    </div>

                                    {event.accessibility_features?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {event.accessibility_features.slice(0, 2).map(feature => (
                                                <span key={feature} className="px-2 py-1 bg-pride-green/10 text-pride-green text-xs rounded">
                                                    {feature}
                                                </span>
                                            ))}
                                            {event.accessibility_features.length > 2 && (
                                                <span className="px-2 py-1 bg-[#27272A] text-zinc-500 text-xs rounded">
                                                    +{event.accessibility_features.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <Button
                                        onClick={() => handleAttend(event.id)}
                                        className="w-full btn-secondary"
                                        data-testid={`attend-btn-${event.id}`}
                                    >
                                        Attend Event
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                            <h3 className="font-lexend text-xl mb-2">No events found</h3>
                            <p className="text-zinc-500 mb-4">Be the first to organize an accessible event!</p>
                            <Button onClick={() => setIsCreateOpen(true)} className="btn-primary" data-testid="empty-create-event-btn">
                                Create Event
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
