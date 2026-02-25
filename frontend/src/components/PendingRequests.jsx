import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { UserCheck, UserX, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL as API } from '../config';

export function PendingRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axios.get(`${API}/connections/pending`);
            setRequests(response.data);
        } catch (error) {
            console.error('Failed to fetch pending requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId, action) => {
        try {
            await axios.put(`${API}/connections/respond/${requestId}`, { action });
            setRequests(requests.filter(req => req.id !== requestId));
            toast.success(`Request ${action === 'accept' ? 'accepted' : 'declined'}`);
        } catch (error) {
            toast.error('Failed to respond to request');
        }
    };

    if (loading) return <div className="p-4 text-center text-zinc-500">Loading requests...</div>;

    if (requests.length === 0) return null;

    return (
        <Card className="bg-[#18181B] border-[#27272A] mb-8">
            <CardHeader>
                <CardTitle className="font-lexend text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-pride-gold" />
                    Pending Connection Requests
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {requests.map((request) => (
                        <div key={request.id} className="p-4 rounded-lg bg-[#121212] border border-[#27272A] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-pride-blue/20 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-pride-blue" />
                                </div>
                                <div className="text-sm">
                                    <div className="font-medium">{request.sender_name || `User ${request.sender_id.substring(0, 8)}`}</div>
                                    <div className="text-zinc-500 text-xs">wants to connect</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-pride-green hover:bg-pride-green/10"
                                    onClick={() => handleAction(request.id, 'accept')}
                                >
                                    <UserCheck className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-pride-red hover:bg-pride-red/10"
                                    onClick={() => handleAction(request.id, 'decline')}
                                >
                                    <UserX className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
