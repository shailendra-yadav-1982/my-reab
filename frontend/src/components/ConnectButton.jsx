import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { UserPlus, UserCheck, Clock, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { API_URL as API } from '../config';

export function ConnectButton({ userId, className }) {
    const { user } = useAuth();
    const [status, setStatus] = useState(null); // null, 'pending', 'accepted', 'declined'
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (user && userId && user.id !== userId) {
            fetchStatus();
        } else {
            setLoading(false);
        }
    }, [user, userId]);

    const fetchStatus = async () => {
        try {
            const response = await axios.get(`${API}/connections/status/${userId}`);
            if (response.data) {
                setStatus(response.data.status);
            }
        } catch (error) {
            console.error('Failed to fetch connection status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        if (!user) {
            toast.error('Please login to connect with members');
            return;
        }

        setActionLoading(true);
        try {
            await axios.post(`${API}/connections/request/${userId}`);
            setStatus('pending');
            toast.success('Connection request sent!');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to send request');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading || !user || user.id === userId) return null;

    if (status === 'accepted') {
        return (
            <Button variant="ghost" size="sm" className={`text-pride-green bg-pride-green/10 hover:bg-pride-green/20 ${className}`} disabled>
                <UserCheck className="w-4 h-4 mr-2" />
                Connected
            </Button>
        );
    }

    if (status === 'pending') {
        return (
            <Button variant="ghost" size="sm" className={`text-pride-gold bg-pride-gold/10 hover:bg-pride-gold/20 ${className}`} disabled>
                <Clock className="w-4 h-4 mr-2" />
                Requested
            </Button>
        );
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className={`btn-secondary ${className}`}
            onClick={handleConnect}
            disabled={actionLoading}
        >
            <UserPlus className="w-4 h-4 mr-2" />
            {actionLoading ? 'Connecting...' : 'Connect'}
        </Button>
    );
}
