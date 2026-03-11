import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Layout } from '../components/Layout';
import SEO from '../components/SEO';
import {
    Users,
    MessageSquare,
    Calendar,
    Building2,
    BookOpen,
    ArrowRight,
    Globe,
    Heart,
    Shield
} from 'lucide-react';
import { MyEnAbLogo } from '../components/MyEnAbLogo';

const features = [
    {
        icon: Users,
        title: 'Global Community',
        description: 'Connect with people who understand your experiences from around the world.',
        color: 'inclusion-red'
    },
    {
        icon: MessageSquare,
        title: 'Discussion Forums',
        description: 'Share stories, ask questions, and support each other in topic-based forums.',
        color: 'inclusion-gold'
    },
    {
        icon: Building2,
        title: 'Service Directory',
        description: 'Find trusted service providers, NGOs, and support organizations near you.',
        color: 'inclusion-white'
    },
    {
        icon: Calendar,
        title: 'Events & Meetups',
        description: 'Discover virtual and in-person events designed with accessibility in mind.',
        color: 'inclusion-blue'
    },
    {
        icon: BookOpen,
        title: 'Resource Library',
        description: 'Access guides, articles, and tools to help navigate daily challenges.',
        color: 'inclusion-green'
    },
    {
        icon: Heart,
        title: 'Direct Messaging',
        description: 'Build meaningful connections through private, secure conversations.',
        color: 'inclusion-red'
    }
];

const stats = [
    { value: '50K+', label: 'Community Members' },
    { value: '1,200+', label: 'Service Providers' },
    { value: '500+', label: 'Monthly Events' },
    { value: '120+', label: 'Countries' }
];

const inclusionColors = [
    { name: 'Life', color: '#E40303', description: 'Red' },
    { name: 'Healing', color: '#FF8C00', description: 'Orange' },
    { name: 'Sunlight', color: '#FFD700', description: 'Yellow' },
    { name: 'Nature', color: '#008026', description: 'Green' },
    { name: 'Serenity', color: '#24408E', description: 'Blue' },
    { name: 'Spirit', color: '#732982', description: 'Purple' }
];

export default function Landing() {
    return (
        <Layout>
            <SEO
                title="Home"
                description="MyEnAb connects the global disability community, persons with disabilities, service providers, entrepreneurs and NGOs.Creating a world where barriers fall and every ability can thrive."
                keywords="MyEnAb, disability inclusion, inclusive community, advocacy, accessibility, service providers, NGOs"
            />
            {/* Hero Section */}
            <section className="relative overflow-hidden" data-testid="hero-section">
                {/* Diagonal Inclusion Stripes Background */}
                <div className="absolute inset-0 inclusion-gradient-bg opacity-50"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div className="max-w-3xl">
                        <div className="flex items-center mb-6 animate-fade-up">
                            <MyEnAbLogo className="w-64 h-20" />
                        </div>

                        <h1 className="font-lexend text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                            Connect. Support.
                            <span className="block mt-2 bg-gradient-to-r from-[#E40303] via-[#FF8C00] via-[#FFD700] via-[#008026] via-[#24408E] to-[#732982] bg-clip-text text-transparent">
                                MyEnAb
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-zinc-300 mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
                            MyEnAb connects the global disability community, persons with disabilities, service providers, entrepreneurs and NGOs.Creating a world where barriers fall and every ability can thrive.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                            <Link to="/register">
                                <Button className="btn-primary text-base px-8 py-4 h-auto" data-testid="hero-join-btn">
                                    Join the Community
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link to="/directory">
                                <Button variant="outline" className="btn-secondary text-base px-8 py-4 h-auto" data-testid="hero-explore-btn">
                                    Explore Services
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Diagonal Cut */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#121212] diagonal-cut-reverse"></div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-b border-[#27272A]" data-testid="stats-section">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={stat.label} className="text-center animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="font-lexend text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-zinc-400 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20" data-testid="features-section">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-lexend text-3xl md:text-4xl font-bold mb-4">
                            Everything You Need to Connect
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Our platform is designed with accessibility at its core, ensuring everyone can participate fully.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            const colorMap = {
                                'inclusion-red': '#E40303',
                                'inclusion-gold': '#FF8C00',
                                'inclusion-yellow': '#FFD700',
                                'inclusion-green': '#008026',
                                'inclusion-blue': '#24408E',
                                'inclusion-purple': '#732982'
                            };
                            const accentColor = colorMap[feature.color] || '#FFFFFF';

                            return (
                                <Card
                                    key={feature.title}
                                    className="bg-[#18181B] border-[#27272A] hover:border-white/20 transition-all duration-300 group animate-fade-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                    data-testid={`feature-card-${index}`}
                                >
                                    <CardContent className="p-6">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: `${accentColor}20` }}
                                        >
                                            <Icon className="w-6 h-6" style={{ color: accentColor }} />
                                        </div>
                                        <h3 className="font-lexend text-xl font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Inclusion Flag Meaning Section */}
            <section className="py-20 bg-[#0a0a0a]" data-testid="inclusion-section">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-lexend text-3xl md:text-4xl font-bold mb-4">
                            The Disability Inclusion Flag
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Each color represents a different aspect of the disability community,
                            designed by Ann Magill to symbolize solidarity and inclusion.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {inclusionColors.map((item, index) => (
                            <div
                                key={item.name}
                                className="relative p-6 rounded-2xl border border-[#27272A] bg-[#121212] animate-fade-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                data-testid={`inclusion-color-${item.name.toLowerCase()}`}
                            >
                                <div
                                    className="w-full h-2 rounded-full mb-4"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <h3 className="font-lexend font-semibold text-lg mb-2" style={{ color: item.color }}>
                                    {item.name}
                                </h3>
                                <p className="text-zinc-400 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-8 rounded-2xl border border-[#27272A] bg-[#18181B]">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-lexend font-semibold text-xl mb-2">The Charcoal Background</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    The charcoal or black background of the flag represents mourning for those who have been
                                    lost to ableism, violence, and abuse. The diagonal band represents "cutting across"
                                    the barriers that separate disabled people from mainstream society.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden" data-testid="cta-section">
                <div className="absolute inset-0 inclusion-gradient-bg opacity-30"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-lexend text-3xl md:text-4xl font-bold mb-6">
                        Ready to Join Our Community?
                    </h2>
                    <p className="text-zinc-300 text-lg max-w-2xl mx-auto mb-8">
                        Whether you're looking for support, want to share your experiences, or represent an organization,
                        there's a place for you here.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <Button className="btn-primary text-base px-8 py-4 h-auto" data-testid="cta-individual-btn">
                                <Users className="w-5 h-5 mr-2" />
                                Join as Individual
                            </Button>
                        </Link>
                        <Link to="/register?type=provider">
                            <Button variant="outline" className="btn-secondary text-base px-8 py-4 h-auto" data-testid="cta-provider-btn">
                                <Building2 className="w-5 h-5 mr-2" />
                                Register as Provider
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
