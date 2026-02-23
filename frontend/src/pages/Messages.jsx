import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Toaster, toast } from 'sonner';
import { ScrollArea } from '../components/ui/scroll-area';
import { Search, Send, MessageSquare, ArrowLeft } from 'lucide-react';

import { API_URL as API } from '../config';

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
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.user_id || selectedUser.id);
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

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

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await axios.get(`${API}/users?limit=10`);
            const filtered = response.data.filter(u =>
                u.id !== user.id && u.name.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filtered);
        } catch (error) {
            console.error('Failed to search users:', error);
        }
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
        setSelectedUser({ user_id: u.id, user_name: u.name });
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <Layout>
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
                                            data-testid={`search-result-${u.id}`}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pride-gold to-pride-green flex items-center justify-center">
                                                <span className="text-xs font-bold text-black">{u.name?.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <span className="text-sm">{u.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <ScrollArea className="flex-1">
                            {loading ? (
                                <div className="p-4 text-center text-zinc-500">Loading...</div>
                            ) : conversations.length > 0 ? (
                                conversations.map((conv) => (
                                    <button
                                        key={conv.user_id}
                                        onClick={() => setSelectedUser(conv)}
                                        className={`w-full p-4 text-left hover:bg-[#27272A] transition-colors flex items-center gap-3 ${selectedUser?.user_id === conv.user_id ? 'bg-[#27272A]' : ''
                                            }`}
                                        data-testid={`conversation-${conv.user_id}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pride-red to-pride-gold flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-bold text-black">{conv.user_name?.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium truncate">{conv.user_name}</span>
                                                {conv.unread_count > 0 && (
                                                    <span className="w-5 h-5 bg-pride-blue rounded-full text-xs flex items-center justify-center">
                                                        {conv.unread_count}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-zinc-400 truncate">{conv.last_message}</p>
                                        </div>
                                    </button>
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
                                <div className="p-4 border-b border-[#27272A] flex items-center gap-3">
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="md:hidden p-2 hover:bg-[#27272A] rounded-lg"
                                        data-testid="back-to-conversations"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pride-red to-pride-gold flex items-center justify-center">
                                        <span className="text-sm font-bold text-black">{selectedUser.user_name?.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <span className="font-semibold">{selectedUser.user_name}</span>
                                </div>

                                {/* Messages */}
                                <ScrollArea className="flex-1 p-4">
                                    <div className="space-y-4">
                                        {messages.map((msg) => {
                                            const isMe = msg.sender_id === user.id;
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                                    data-testid={`message-${msg.id}`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] px-4 py-3 rounded-2xl ${isMe
                                                                ? 'bg-white text-black rounded-br-sm'
                                                                : 'bg-[#27272A] text-white rounded-bl-sm'
                                                            }`}
                                                    >
                                                        <p className="text-sm">{msg.content}</p>
                                                        <span className={`text-xs ${isMe ? 'text-zinc-600' : 'text-zinc-500'} mt-1 block`}>
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>

                                {/* Message Input */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-[#27272A]" data-testid="message-form">
                                    <div className="flex gap-3">
                                        <Input
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
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
