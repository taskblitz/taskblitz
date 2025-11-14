'use client'
import { Header } from '@/components/Header'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-text-secondary mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="glass-card p-8 space-y-6 text-text-secondary">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-white mb-2">Wallet Information:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
              <li>Solana wallet address (public)</li>
              <li>Transaction history on TaskBlitz</li>
              <li>Task completion records</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-2">Usage Data:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
              <li>Pages visited and features used</li>
              <li>Time spent on platform</li>
              <li>Browser type and device information</li>
              <li>IP address (for security purposes)</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-2">Task Data:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Task descriptions and requirements</li>
              <li>Submitted work and proof</li>
              <li>Communications between users</li>
              <li>Ratings and reviews</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>To provide and improve our services</li>
              <li>To process transactions and payments</li>
              <li>To prevent fraud and abuse</li>
              <li>To resolve disputes</li>
              <li>To communicate important updates</li>
              <li>To analyze platform usage and performance</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. Information Sharing</h2>
            <p className="mb-2">We do NOT sell your personal information. We may share data with:</p>
            
            <h3 className="text-lg font-semibold text-white mb-2">Other Users:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
              <li>Your wallet address is visible to other users</li>
              <li>Your reputation score and completed tasks are public</li>
              <li>Task-related communications are visible to involved parties</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-2">Service Providers:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
              <li>Hosting and infrastructure providers</li>
              <li>Analytics services (Google Analytics, Microsoft Clarity)</li>
              <li>Email service providers</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-2">Legal Requirements:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>When required by law or legal process</li>
              <li>To protect our rights and safety</li>
              <li>To prevent fraud or illegal activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Blockchain Transparency</h2>
            <p>
              TaskBlitz is built on the Solana blockchain. All transactions are publicly visible on the blockchain. 
              This includes:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>Payment amounts and timestamps</li>
              <li>Wallet addresses involved</li>
              <li>Smart contract interactions</li>
            </ul>
            <p className="mt-2">
              This is inherent to blockchain technology and cannot be changed. However, your wallet address is 
              pseudonymous and not directly linked to your real identity unless you choose to reveal it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Data Security</h2>
            <p className="mb-2">We implement security measures to protect your data:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Encrypted connections (HTTPS)</li>
              <li>Secure database storage</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Rate limiting to prevent abuse</li>
            </ul>
            <p className="mt-2">
              However, no system is 100% secure. You are responsible for keeping your wallet and seed phrase secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">6. Cookies and Tracking</h2>
            <p className="mb-2">We use cookies and similar technologies for:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Maintaining your session</li>
              <li>Remembering your preferences</li>
              <li>Analytics and performance monitoring</li>
              <li>Security and fraud prevention</li>
            </ul>
            <p className="mt-2">
              You can disable cookies in your browser, but this may affect platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">7. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Access your personal data</li>
              <li>Request data correction or deletion</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
              <li>Close your account</li>
            </ul>
            <p className="mt-2">
              Note: Blockchain transactions cannot be deleted as they are permanently recorded on the blockchain.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">8. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active or as needed to provide services. 
              After account closure, we may retain certain data for:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>Legal compliance (typically 7 years)</li>
              <li>Dispute resolution</li>
              <li>Fraud prevention</li>
              <li>Analytics (anonymized)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">9. Children's Privacy</h2>
            <p>
              TaskBlitz is not intended for users under 18 years old. We do not knowingly collect information 
              from children. If we discover that a child has provided us with personal information, we will 
              delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">10. International Users</h2>
            <p>
              TaskBlitz is accessible globally. By using our platform, you consent to the transfer and processing 
              of your data in various jurisdictions. We comply with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">11. Third-Party Links</h2>
            <p>
              Our platform may contain links to third-party websites or services. We are not responsible for 
              their privacy practices. Please review their privacy policies before providing any information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">12. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify users of significant changes 
              via email or platform announcement. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">13. Contact Us</h2>
            <p>
              For privacy-related questions or to exercise your rights, contact us at:{' '}
              <a href="mailto:taskblitzclick@gmail.com" className="text-purple-400 hover:text-purple-300">
                taskblitzclick@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>    </main>
  )
}
