import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout';

const Privacy = () => {
    return (
        <Layout>
            <Helmet>
                <title>Privacy Policy - MyEnAb</title>
                <meta name="description" content="Privacy Policy for MyEnAb platform." />
            </Helmet>
            <div className="max-w-4xl mx-auto px-4 py-12 text-zinc-300">
                <h1 className="text-4xl font-lexend font-bold text-white mb-8">Privacy Policy</h1>
                <div className="space-y-6 text-lg">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <h2 className="text-2xl font-bold text-white mt-8">1. Introduction</h2>
                    <p>Welcome to MyEnAb. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>

                    <h2 className="text-2xl font-bold text-white mt-8">2. The Data We Collect About You</h2>
                    <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                        <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white mt-8">3. How We Use Your Personal Data</h2>
                    <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal obligation.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white mt-8">4. Data Security</h2>
                    <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed.</p>

                    <h2 className="text-2xl font-bold text-white mt-8">5. Your Legal Rights</h2>
                    <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.</p>

                    <h2 className="text-2xl font-bold text-white mt-8">6. Contact Us</h2>
                    <p>If you have any questions about this privacy policy or our privacy practices, please contact us.</p>
                </div>
            </div>
        </Layout>
    );
};

export default Privacy;
