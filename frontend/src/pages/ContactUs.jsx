import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally send the data to the backend
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Reset success message after a few seconds
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    return (
        <Layout>
            <Helmet>
                <title>Contact Us - MyEnAb</title>
                <meta name="description" content="Get in touch with the MyEnAb team for support, inquiries, or feedback." />
            </Helmet>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-lexend font-bold text-white mb-4">Contact Us</h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Have a question, feedback, or need assistance? We're here to help. Reach out to the MyEnAb team using the form or contact information below.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h2 className="text-2xl font-lexend font-semibold text-white mb-6">Get in Touch</h2>
                            <p className="text-zinc-400 mb-8">
                                Our support team is ready to assist you. Whether you're a user, service provider, or an organization, we'd love to hear from you.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <Card className="bg-[#18181B] border-[#27272A]">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#24408E]/20 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">Email</h3>
                                        <p className="text-zinc-400 text-sm mb-2">For general inquiries and support</p>
                                        <a href="mailto:support@myenab.com" className="text-[#38BDF8] hover:underline">
                                            support@myenab.com
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#18181B] border-[#27272A]">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#E40303]/20 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-[#FF5C5C]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">Phone</h3>
                                        <p className="text-zinc-400 text-sm mb-2">Mon-Fri from 9am to 6pm</p>
                                        <a href="tel:+1234567890" className="text-[#FF5C5C] hover:underline">
                                            +1 (234) 567-890
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#18181B] border-[#27272A]">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#008026]/20 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-[#34D399]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">Office</h3>
                                        <p className="text-zinc-400 text-sm">
                                            123 Inclusive Ave<br />
                                            Accessibility City, AC 12345<br />
                                            United States
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="bg-[#18181B] border-[#27272A] h-full">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-lexend font-semibold text-white mb-6">Send us a Message</h2>
                                
                                {isSubmitted ? (
                                    <div className="bg-[#008026]/20 border border-[#008026] text-[#34D399] p-4 rounded-lg text-center font-medium animate-fade-in">
                                        Thank you for reaching out! We will get back to you as soon as possible.
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium text-zinc-300">
                                                    Full Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-[#121212] border border-[#27272A] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                                                    Email Address <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-[#121212] border border-[#27272A] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium text-zinc-300">
                                                Subject <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-[#121212] border border-[#27272A] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all"
                                                placeholder="How can we help?"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium text-zinc-300">
                                                Message <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={6}
                                                className="w-full bg-[#121212] border border-[#27272A] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all resize-none"
                                                placeholder="Type your message here..."
                                            ></textarea>
                                        </div>

                                        <Button type="submit" className="w-full py-6 flex items-center justify-center gap-2 btn-primary">
                                            <span>Send Message</span>
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ContactUs;
