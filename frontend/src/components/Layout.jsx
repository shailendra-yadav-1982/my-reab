import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
    Home,
    Users,
    MessageSquare,
    Calendar,
    BookOpen,
    Building2,
    User,
    LogOut,
    Menu,
    X,
    Settings
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/forums', label: 'Forums', icon: MessageSquare },
    { path: '/directory', label: 'Directory', icon: Building2 },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/community', label: 'Community', icon: Users },
];

export const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#121212]">
            {/* Skip Link for Accessibility */}
            <a href="#main-content" className="skip-link" data-testid="skip-link">
                Skip to main content
            </a>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 border-b border-[#27272A] bg-[#121212]/95 backdrop-blur-sm" role="navigation" aria-label="Main navigation">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3" data-testid="nav-logo">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center pride-border-left bg-[#18181B]">
                                <span className="font-lexend font-bold text-lg">DP</span>
                            </div>
                            <span className="font-lexend font-semibold text-lg hidden sm:block">Pride Connect</span>
                        </Link>

                        {/* Desktop Navigation */}
                        {user && (
                            <div className="hidden md:flex items-center gap-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                                isActive
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                            }`}
                                            data-testid={`nav-${item.label.toLowerCase()}`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            {user ? (
                                <>
                                    <Link to="/messages" className="relative" data-testid="nav-messages">
                                        <MessageSquare className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
                                    </Link>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#121212] rounded-full" data-testid="user-menu-trigger">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pride-red to-pride-gold flex items-center justify-center">
                                                    <span className="text-sm font-bold text-black">{user.name?.charAt(0).toUpperCase()}</span>
                                                </div>
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 bg-[#18181B] border-[#27272A]">
                                            <div className="px-3 py-2">
                                                <p className="text-sm font-medium text-white">{user.name}</p>
                                                <p className="text-xs text-zinc-400">{user.email}</p>
                                            </div>
                                            <DropdownMenuSeparator className="bg-[#27272A]" />
                                            <DropdownMenuItem asChild>
                                                <Link to="/profile" className="flex items-center gap-2 cursor-pointer" data-testid="menu-profile">
                                                    <User className="w-4 h-4" />
                                                    Profile
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link to="/settings" className="flex items-center gap-2 cursor-pointer" data-testid="menu-settings">
                                                    <Settings className="w-4 h-4" />
                                                    Settings
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-[#27272A]" />
                                            <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-400 cursor-pointer" data-testid="menu-logout">
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Logout
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Mobile Menu Button */}
                                    <button
                                        className="md:hidden p-2 rounded-lg hover:bg-white/5"
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                        aria-label="Toggle menu"
                                        data-testid="mobile-menu-toggle"
                                    >
                                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login">
                                        <Button variant="ghost" className="text-zinc-300 hover:text-white" data-testid="nav-login">
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button className="btn-primary text-sm px-6 py-2" data-testid="nav-register">
                                            Join Now
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {user && mobileMenuOpen && (
                    <div className="md:hidden border-t border-[#27272A] bg-[#121212]">
                        <div className="px-4 py-4 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-white/10 text-white'
                                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                        }`}
                                        data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main id="main-content" className="min-h-[calc(100vh-4rem)]">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-[#27272A] bg-[#0a0a0a]" role="contentinfo">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center pride-border-left bg-[#18181B]">
                                    <span className="font-lexend font-bold text-lg">DP</span>
                                </div>
                                <span className="font-lexend font-semibold text-lg">Pride Connect</span>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                                A global platform connecting people with disabilities, service providers, and NGOs. 
                                Building community, breaking barriers, celebrating pride.
                            </p>
                            <div className="flex gap-2 mt-4">
                                <span className="w-3 h-3 rounded-full bg-pride-red"></span>
                                <span className="w-3 h-3 rounded-full bg-pride-gold"></span>
                                <span className="w-3 h-3 rounded-full bg-pride-white"></span>
                                <span className="w-3 h-3 rounded-full bg-pride-blue"></span>
                                <span className="w-3 h-3 rounded-full bg-pride-green"></span>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-lexend font-semibold mb-4">Platform</h4>
                            <ul className="space-y-2 text-sm text-zinc-400">
                                <li><Link to="/forums" className="hover:text-white transition-colors">Forums</Link></li>
                                <li><Link to="/directory" className="hover:text-white transition-colors">Directory</Link></li>
                                <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
                                <li><Link to="/resources" className="hover:text-white transition-colors">Resources</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-lexend font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm text-zinc-400">
                                <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-[#27272A] mt-8 pt-8 text-center text-sm text-zinc-500">
                        <p>&copy; {new Date().getFullYear()} Disability Pride Connect. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
