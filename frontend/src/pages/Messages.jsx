import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import SEO from '../components/SEO';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Toaster, toast } from 'sonner';
import { ScrollArea } from '../components/ui/scroll-area';
import { Search, Send, MessageSquare, ArrowLeft } from 'lucide-react';

import { API_URL as API, SOCKET_URL } from '../config';

export default function Messages() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [connections, setConnections] = useState([]);
    const [loadingConnections, setLoadingConnections] = useState(true);

    const [ws, setWs] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [typingUsers, setTypingUsers] = useState({}); // senderId -> boolean
    const typingTimeoutRef = useRef({});
    const selectedUserRef = useRef(null);

    // Keep ref in sync
    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    useEffect(() => {
        if (!user?.id) return;
        const socket = new WebSocket(`${SOCKET_URL}/api/ws/${user.id}`);

        socket.onopen = () => {
            console.log('WebSocket Connected');
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('WS Event Received:', data);
                
                if (data.type === 'initial_presence') {
                    setOnlineUsers(new Set(data.online_users.map(id => String(id))));
                } else if (data.type === 'new_message') {
                    const msg = data.message;
                    const currentSelected = selectedUserRef.current;
                    const contactId = currentSelected?.id || currentSelected?.user_id;
                    
                    if (contactId && String(msg.sender_id) === String(contactId)) {
                        setMessages(prev => [...prev, msg]);
                    }
                    fetchConversations();
                } else if (data.type === 'presence') {
                    setOnlineUsers(prev => {
                        const next = new Set(prev);
                        const uid = String(data.user_id);
                        if (data.status === 'online') next.add(uid);
                        else next.delete(uid);
                        return next;
                    });
                } else if (data.type === 'typing') {
                    setTypingUsers(prev => ({
                        ...prev,
                        [String(data.sender_id)]: data.is_typing
                    }));
                }
            } catch (err) {
                console.error('Error parsing WS message:', err);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket Disconnected');
        };

        setWs(socket);
        return () => {
            console.log('Cleaning up WebSocket');
            socket.close();
        };
    }, [user?.id]);

    const handleTyping = (e) => {
        const value = e.target.value;
        setNewMessage(value);

        if (!ws || !selectedUser) return;

        const recipientId = selectedUser.id || selectedUser.user_id;

        // Emit typing: true
        ws.send(JSON.stringify({
            type: 'typing',
            recipient_id: recipientId,
            is_typing: true
        }));

        // Clear existing timeout
        if (typingTimeoutRef.current[recipientId]) {
            clearTimeout(typingTimeoutRef.current[recipientId]);
        }

        // Set timeout to emit typing: false
        typingTimeoutRef.current[recipientId] = setTimeout(() => {
            ws.send(JSON.stringify({
                type: 'typing',
                recipient_id: recipientId,
                is_typing: false
            }));
            delete typingTimeoutRef.current[recipientId];
        }, 3000);
    };

    useEffect(() => {
        fetchConversations();
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            const response = await axios.get(`${API}/connections`);
            setConnections(response.data);
        } catch (error) {
            console.error('Failed to fetch connections:', error);
        } finally {
            setLoadingConnections(false);
        }
    };

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.user_id || selectedUser.id);
        }
    }, [selectedUser]);


    const fetchConversations = async () => {
        try {
            const response = await axios.get(`${API}/messages/conversations`);
            setConversations(response.data);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const response = await axios.get(`${API}/messages/${userId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim().length < 1) {
            setSearchResults([]);
            return;
        }
        
        // Search within connections
        const results = connections.filter(conn => {
            const partnerName = conn.sender_id === user.id ? conn.receiver_name : conn.sender_name;
            return partnerName.toLowerCase().includes(query.toLowerCase());
        }).map(conn => ({
            id: conn.sender_id === user.id ? conn.receiver_id : conn.sender_id,
            name: conn.sender_id === user.id ? conn.receiver_name : conn.sender_name
        }));
        
        setSearchResults(results);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        setSending(true);
        try {
            const recipientId = selectedUser.user_id || selectedUser.id;
            await axios.post(`${API}/messages`, {
                recipient_id: recipientId,
                content: newMessage
            });
            setMessages([...messages, {
                id: Date.now().toString(),
                sender_id: user.id,
                sender_name: user.name,
                recipient_id: recipientId,
                content: newMessage,
                created_at: new Date().toISOString(),
                is_read: false
            }]);
            setNewMessage('');
            fetchConversations();
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const selectUserFromSearch = (u) => {
        setSelectedUser({ id: u.id, name: u.name });
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <Layout>
            <SEO
                title="Messages"
                description="Connect privately with other members of the MyEnAb community."
            />
            <Toaster position="top-center" richColors />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="messages-page">
                <div className="h-[calc(100vh-12rem)] flex bg-[#18181B] rounded-2xl border border-[#27272A] overflow-hidden">
                    {/* Conversations Sidebar */}
                    <div className={`w-full md:w-80 border-r border-[#27272A] flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-4 border-b border-[#27272A]">
                            <h2 className="font-lexend text-lg font-semibold mb-4">Messages</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <Input
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="input-dark pl-9 py-2"
                                    data-testid="search-users-input"
                                />
                            </div>
                            {searchResults.length > 0 && (
                                <div className="absolute z-10 mt-1 w-[calc(100%-2rem)] bg-[#121212] border border-[#27272A] rounded-lg shadow-lg">
                                    {searchResults.map(u => (
                                        <button
                                            key={u.id}
                                            onClick={() => selectUserFromSearch(u)}
                                            className="w-full px-4 py-3 text-left hover:bg-[#27272A] flex items-center gap-3"
                                        >
                                            <div className="relative">
                                                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center font-bold">
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                {onlineUsers.has(String(u.id)) && (
                                                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-[#121212]"></div>
                                                )}
                                            </div>
                                            <span className="text-sm">{u.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <ScrollArea className="flex-1">
                            {/* Connected Members Section */}
                            {!searchQuery && connections.length > 0 && (
                                <div className="py-4 border-b border-[#27272A]">
                                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-4">Connected Members</h3>
                                    <div className="flex gap-4 overflow-x-auto -mx-4 px-4 pb-4 pt-1 no-scrollbar">
                                        {connections.map(conn => {
                                            const partnerId = conn.sender_id === user.id ? conn.receiver_id : conn.sender_id;
                                            const partnerName = conn.sender_id === user.id ? conn.receiver_name : conn.sender_name;
                                            const isOnline = onlineUsers.has(String(partnerId));
                                            
                                            const isSelected = selectedUser?.id === partnerId;
                                            
                                            return (
                                                <button
                                                    key={partnerId}
                                                    onClick={() => setSelectedUser({ id: partnerId, name: partnerName })}
                                                    className={`flex flex-col items-center gap-1 min-w-[64px] p-2 m-0.5 rounded-xl transition-colors ${isSelected ? 'bg-[#2a3942]' : 'hover:bg-[#202c33]'}`}
                                                >
                                                    <div className="relative">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${isOnline ? 'bg-zinc-700 border-2 border-green-500' : 'bg-zinc-800 border border-[#27272A]'}`}>
                                                            {partnerName[0]}
                                                        </div>
                                                        {isOnline && (
                                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#18181B]"></div>
                                                        )}
                                                    </div>
                                                    <span className={`text-[10px] truncate w-16 text-center ${isSelected ? 'text-white font-medium' : 'text-zinc-400'}`}>
                                                        {partnerName.split(' ')[0]}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="p-4 py-2 bg-[#1c1c1f] text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                                Recent Chats
                            </div>
                            {loading ? (
                                <div className="p-4 text-center text-zinc-500">Loading...</div>
                            ) : conversations.length > 0 ? (
                                conversations.map((conv) => (
                                    <div 
                                        key={conv.user_id} 
                                        onClick={() => setSelectedUser({ id: conv.user_id, name: conv.user_name })}
                                        className={`p-4 cursor-pointer hover:bg-[#202c33] transition-colors flex items-center gap-3 ${selectedUser?.id === conv.user_id ? 'bg-[#2a3942]' : ''}`}
                                    >
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-lg font-bold">
                                                {conv.user_name[0]}
                                            </div>
                                            {onlineUsers.has(String(conv.user_id)) && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111b21]"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="font-medium truncate">{conv.user_name}</h4>
                                                <span className="text-xs text-zinc-500">
                                                    {conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </span>
                                            </div>
                                            <p className="text-sm text-zinc-400 truncate">{conv.last_message}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-zinc-500">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No conversations yet</p>
                                    <p className="text-xs mt-2">Search for users to start chatting</p>
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    {/* Chat Area */}
                    <div className={`flex-1 flex flex-col ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
                        {selectedUser ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-[#27272A] flex items-center gap-3 bg-[#202c33]">
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="md:hidden p-1 hover:bg-[#2a3942] rounded-full transition-colors"
                                    >
                                        <ArrowLeft className="w-6 h-6" />
                                    </button>
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center font-bold">
                                            {(selectedUser.name || selectedUser.user_name)[0]}
                                        </div>
                                        {onlineUsers.has(String(selectedUser.id || selectedUser.user_id)) && (
                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#202c33]"></div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-lexend font-medium">{selectedUser.name || selectedUser.user_name}</h3>
                                        <p className="text-xs text-zinc-400">
                                            {typingUsers[String(selectedUser.id || selectedUser.user_id)] 
                                                ? <span className="text-inclusion-gold animate-pulse">Typing...</span>
                                                : (onlineUsers.has(String(selectedUser.id || selectedUser.user_id)) ? 'Online' : 'Active conversation')
                                            }
                                        </p>
                                    </div>
                                </div>
                                {/* Messages */}
                                <ScrollArea className="flex-1 p-4">
                                    <div className="space-y-4">
                                        {messages.map((msg) => {
                                            const myId = user?.id || user?._id;
                                            const sId = msg.sender_id || msg.sender?.id;
                                            const isMe = !!myId && !!sId && String(myId) === String(sId);
                                            
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className="flex w-full mb-2"
                                                    data-testid={`message-${msg.id}`}
                                                >
                                                    <div
                                                        className={`relative flex flex-col max-w-[80%] min-w-[100px] px-3 pt-1.5 pb-5 shadow-sm ${isMe
                                                                ? 'bg-[#005c4b] text-white rounded-lg rounded-tr-none ml-auto'
                                                                : 'bg-[#202c33] text-white rounded-lg rounded-tl-none mr-auto'
                                                            }`}
                                                    >
                                                        <div className="text-[15px] leading-relaxed break-words">
                                                            {msg.content}
                                                        </div>
                                                        <div className={`absolute bottom-1 right-2 text-[10px] ${isMe ? 'text-zinc-300/90' : 'text-zinc-400/90'} select-none`}>
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>

                                {/* Message Input */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-[#27272A]" data-testid="message-form">
                                    <div className="flex gap-3">
                                        <Input
                                            value={newMessage}
                                            onChange={handleTyping}
                                            placeholder="Type a message..."
                                            className="input-dark flex-1"
                                            data-testid="message-input"
                                        />
                                        <Button type="submit" disabled={sending || !newMessage.trim()} className="btn-primary px-4" data-testid="send-message-btn">
                                            <Send className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-center p-8">
                                <div>
                                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                                    <h3 className="font-lexend text-xl mb-2">Select a conversation</h3>
                                    <p className="text-zinc-500">Choose a conversation or search for users to start chatting</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
