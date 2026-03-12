import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout';

const TermsOfService = () => {
    return (
        <Layout>
            <Helmet>
                <title>Terms of Service - MyEnAb</title>
                <meta name="description" content="Terms of Service for MyEnAb platform." />
            </Helmet>
            <div className="max-w-4xl mx-auto px-4 py-12 text-zinc-300">
                <h1 className="text-4xl font-lexend font-bold text-white mb-8">Terms of Service</h1>
                <div className="space-y-6 text-lg">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <h2 className="text-2xl font-bold text-white mt-8">1. Terms</h2>
                    <p>By accessing this Website, accessible from the MyEnAb domain, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.</p>

                    <h2 className="text-2xl font-bold text-white mt-8">2. Use License</h2>
                    <p>Permission is granted to temporarily download one copy of the materials on MyEnAb's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>modify or copy the materials;</li>
                        <li>use the materials for any commercial purpose or for any public display;</li>
                        <li>attempt to reverse engineer any software contained on MyEnAb's Website;</li>
                        <li>remove any copyright or other proprietary notations from the materials; or</li>
                        <li>transferring the materials to another person or "mix" the materials on any other server.</li>
                    </ul>
                    <p>This will let MyEnAb to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format.</p>

                    <h2 className="text-2xl font-bold text-white mt-8">3. Disclaimer</h2>
                    <p>All the materials on MyEnAb's Website are provided "as is". MyEnAb makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, MyEnAb does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.</p>

                    <h2 className="text-2xl font-bold text-white mt-8">4. Limitations</h2>
                    <p>MyEnAb or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on MyEnAb's Website, even if MyEnAb or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.</p>

                    <h2 className="text-2xl font-bold text-white mt-8">5. Revisions and Errata</h2>
                    <p>The materials appearing on MyEnAb's Website may include technical, typographical, or photographic errors. MyEnAb will not promise that any of the materials in this Website are accurate, complete, or current. MyEnAb may change the materials contained on its Website at any time without notice. MyEnAb does not make any commitment to update the materials.</p>

                    <h2 className="text-2xl font-bold text-white mt-8">6. Links</h2>
                    <p>MyEnAb has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by MyEnAb of the site. The use of any linked website is at the user's own risk.</p>

                    <h2 className="text-2xl font-bold text-white mt-8">7. Site Terms of Use Modifications</h2>
                    <p>MyEnAb may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.</p>

                    <h2 className="text-2xl font-bold text-white mt-8">8. Governing Law</h2>
                    <p>Any claim related to MyEnAb's Website shall be governed by the laws without regards to its conflict of law provisions.</p>
                </div>
            </div>
        </Layout>
    );
};

export default TermsOfService;
