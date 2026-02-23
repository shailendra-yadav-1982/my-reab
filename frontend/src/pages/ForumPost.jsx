import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Toaster, toast } from 'sonner';
import { ArrowLeft, Heart, MessageSquare, Clock, Send } from 'lucide-react';

import { API_URL as API } from '../config';

export default function ForumPost() {
    const { postId } = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`${API}/forums/${postId}`);
            setPost(response.data);
        } catch (error) {
            console.error('Failed to fetch post:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`${API}/forums/${postId}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };

    const handleLike = async () => {
        if (!user) {
            toast.error('Please login to like posts');
            return;
        }
        try {
            const response = await axios.post(`${API}/forums/${postId}/like`);
            setPost(prev => ({
                ...prev,
                likes: response.data.liked ? prev.likes + 1 : prev.likes - 1
            }));
        } catch (error) {
            toast.error('Failed to like post');
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to comment');
            return;
        }
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const response = await axios.post(`${API}/forums/${postId}/comments`, {
                content: newComment
            });
            setComments([...comments, response.data]);
            setNewComment('');
            setPost(prev => ({ ...prev, comments_count: prev.comments_count + 1 }));
            toast.success('Comment added!');
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center py-12 text-zinc-500">Loading post...</div>
                </div>
            </Layout>
        );
    }

    if (!post) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <h2 className="font-lexend text-2xl mb-4">Post not found</h2>
                        <Link to="/forums">
                            <Button className="btn-secondary">Back to Forums</Button>
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Toaster position="top-center" richColors />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Link */}
                <Link to="/forums" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6" data-testid="back-to-forums">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Forums
                </Link>

                {/* Post */}
                <Card className="bg-[#18181B] border-[#27272A] mb-8" data-testid="forum-post">
                    <CardContent className="p-6 md:p-8">
                        <div className="mb-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-pride-gold/20 text-pride-gold">
                                {post.category}
                            </span>
                        </div>
                        <h1 className="font-lexend text-2xl md:text-3xl font-bold mb-4">{post.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-zinc-400 mb-6">
                            <span className="text-white font-medium">{post.author_name}</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(post.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="prose prose-invert max-w-none mb-6">
                            <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                        </div>
                        {post.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 text-sm bg-[#27272A] rounded-full text-zinc-400">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="flex items-center gap-6 pt-6 border-t border-[#27272A]">
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-2 text-zinc-400 hover:text-pride-red transition-colors"
                                data-testid="like-post-btn"
                            >
                                <Heart className="w-5 h-5" />
                                <span>{post.likes} likes</span>
                            </button>
                            <span className="flex items-center gap-2 text-zinc-400">
                                <MessageSquare className="w-5 h-5" />
                                {post.comments_count} comments
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Comments Section */}
                <div data-testid="comments-section">
                    <h2 className="font-lexend text-xl font-semibold mb-6">Comments ({comments.length})</h2>

                    {/* Comment Form */}
                    {user ? (
                        <form onSubmit={handleSubmitComment} className="mb-8" data-testid="comment-form">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pride-blue to-pride-green flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold text-black">{user.name?.charAt(0).toUpperCase()}</span>
                                </div>
                                <div className="flex-1">
                                    <Textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Share your thoughts..."
                                        rows={3}
                                        className="input-dark resize-none mb-3"
                                        data-testid="comment-input"
                                    />
                                    <Button type="submit" disabled={submitting || !newComment.trim()} className="btn-primary" data-testid="submit-comment-btn">
                                        <Send className="w-4 h-4 mr-2" />
                                        {submitting ? 'Posting...' : 'Post Comment'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <Card className="bg-[#18181B] border-[#27272A] mb-8">
                            <CardContent className="p-6 text-center">
                                <p className="text-zinc-400 mb-4">Login to join the conversation</p>
                                <Link to="/login">
                                    <Button className="btn-secondary">Sign In</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <Card key={comment.id} className="bg-[#121212] border-[#27272A]" data-testid={`comment-${comment.id}`}>
                                    <CardContent className="p-4 md:p-6">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#27272A] flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-bold">{comment.author_name?.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-medium">{comment.author_name}</span>
                                                    <span className="text-xs text-zinc-500">
                                                        {new Date(comment.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-zinc-300">{comment.content}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-8 text-zinc-500">
                                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No comments yet. Be the first to share your thoughts!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
