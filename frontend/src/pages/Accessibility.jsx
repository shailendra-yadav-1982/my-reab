import { Layout } from '../components/Layout';
import SEO from '../components/SEO';
import { Card, CardContent } from '../components/ui/card';
import { 
    Keyboard, 
    MousePointer, 
    Type, 
    Video, 
    Accessibility as AccessibilityIcon,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

const accessibilityFeatures = [
    {
        title: 'Universal Design',
        description: 'Our platform is built with a mobile-first, universal design approach to ensure readability and usability across all devices.',
        icon: AccessibilityIcon,
        color: '#FF5C5C'
    },
    {
        title: 'Keyboard Navigation',
        description: 'Full support for keyboard navigation, including skip links and clear focus indicators for all interactive elements.',
        icon: Keyboard,
        color: '#FFD700'
    },
    {
        title: 'Semantic HTML',
        description: 'We use meaningful HTML5 tags and ARIA labels to provide a predictable and compatible context for screen readers.',
        icon: CheckCircle2,
        color: '#F4F4F5'
    },
    {
        title: 'High Contrast UI',
        description: 'Guided by WCAG AA standards, our dark-themed interface minimizes eye strain and ensures text is easy to read.',
        icon: Type,
        color: '#38BDF8'
    },
    {
        title: 'Assistive Tech Ready',
        description: 'Optimized for modern screen readers (NVDA, JAWS) and alternative input devices like switches and trackballs.',
        icon: MousePointer,
        color: '#34D399'
    }
];

export default function Accessibility() {
    return (
        <Layout>
            <SEO 
                title="Accessibility Commitment" 
                description="Learn about MyEnAb's commitment to creating a barrier-free digital environment for our diverse global community."
            />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-up">
                    <h1 className="font-lexend text-4xl md:text-5xl font-bold mb-6">
                        Our Commitment to <span className="text-inclusion-blue">Inclusion</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-3xl mx-auto leading-relaxed">
                        At MyEnAb (My Enable Ability), accessibility isn't a feature—it's our foundation. 
                        We believe that digital barriers should never stand in the way of community and connection.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {accessibilityFeatures.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card 
                                key={feature.title} 
                                className="bg-[#18181B] border-[#27272A] hover:border-white/20 transition-all group animate-fade-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <CardContent className="p-8">
                                    <div 
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                        style={{ backgroundColor: `${feature.color}15` }}
                                    >
                                        <Icon className="w-8 h-8" style={{ color: feature.color }} />
                                    </div>
                                    <h2 className="font-lexend text-2xl font-bold mb-4">{feature.title}</h2>
                                    <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Reporting Barriers */}
                <div className="bg-[#0a0a0a] border border-[#27272A] rounded-3xl p-8 md:p-12 animate-fade-up">
                    <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <div className="w-20 h-20 rounded-full bg-inclusion-blue/20 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-10 h-10 text-inclusion-blue" />
                        </div>
                        <div className="flex-1">
                            <h2 className="font-lexend text-3xl font-bold mb-4">Encountered a Barrier?</h2>
                            <p className="text-zinc-400 text-lg mb-6">
                                While we strive for perfection, we may occasionally miss something. If you find any part 
                                of our platform difficult to use, please let us know so we can fix it.
                            </p>
                            <a 
                                href="/contact" 
                                className="inline-flex items-center text-inclusion-blue font-semibold hover:underline text-lg"
                            >
                                Report an Accessibility Issue &rarr;
                            </a>
                        </div>
                    </div>
                </div>

                {/* Future Roadmap */}
                <div className="mt-20 text-center animate-fade-up">
                    <h2 className="font-lexend text-3xl font-bold mb-6">Our Roadmap</h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto italic">
                        "Real inclusion happens when we listen. We are currently working on adding AI-powered image 
                        descriptions and real-time captioning support for community events."
                    </p>
                </div>
            </div>
        </Layout>
    );
}
