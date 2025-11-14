'use client'
import { Header } from '@/components/Header'

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-text-secondary mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="glass-card p-8 space-y-6 text-text-secondary">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using TaskBlitz, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to these Terms of Service, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. Description of Service</h2>
            <p className="mb-2">
              TaskBlitz is a decentralized micro-task marketplace built on the Solana blockchain. The platform connects:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Clients who need work completed</li>
              <li>Workers who complete tasks for cryptocurrency payments</li>
            </ul>
            <p className="mt-2">
              All payments are processed through smart contracts and secured by blockchain technology.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. User Responsibilities</h2>
            <h3 className="text-lg font-semibold text-white mb-2">For All Users:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
              <li>You must be at least 18 years old to use TaskBlitz</li>
              <li>You are responsible for maintaining the security of your wallet</li>
              <li>You must provide accurate information</li>
              <li>You agree not to engage in fraudulent activities</li>
              <li>You will comply with all applicable laws and regulations</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-2">For Workers:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
              <li>Complete tasks according to specifications</li>
              <li>Submit original work (no plagiarism)</li>
              <li>Meet agreed-upon deadlines</li>
              <li>Communicate professionally with clients</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-2">For Clients:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provide clear task descriptions and requirements</li>
              <li>Set fair compensation for work</li>
              <li>Review and approve work in a timely manner</li>
              <li>Only reject work for legitimate reasons</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Payments and Fees</h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>TaskBlitz charges a 10% platform fee, added to the task cost</li>
              <li>Workers receive 100% of the posted task reward</li>
              <li>Clients pay the task reward plus 10% platform fee</li>
              <li>Blockchain transaction fees are separate and paid to network validators</li>
              <li>All payments are made in USDC (USD Coin)</li>
              <li>Payments are processed through smart contracts and are non-reversible once approved</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Escrow and Smart Contracts</h2>
            <p>
              When a task is posted, payment is locked in a smart contract escrow. Funds are released automatically when:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>The client approves completed work, OR</li>
              <li>A dispute is resolved in favor of the worker</li>
            </ul>
            <p className="mt-2">
              TaskBlitz does not hold custody of funds. All payments are managed by smart contracts on the Solana blockchain.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">6. Disputes</h2>
            <p className="mb-2">
              If a disagreement arises between a client and worker:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Either party may open a dispute</li>
              <li>Both parties can submit evidence</li>
              <li>TaskBlitz admins will review and make a decision</li>
              <li>Decisions are final and binding</li>
              <li>Funds remain in escrow until dispute is resolved</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">7. Prohibited Activities</h2>
            <p className="mb-2">Users may not:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Engage in fraudulent activities</li>
              <li>Submit plagiarized or stolen work</li>
              <li>Create multiple accounts to manipulate the system</li>
              <li>Harass or abuse other users</li>
              <li>Post illegal or inappropriate content</li>
              <li>Attempt to circumvent platform fees</li>
              <li>Use automated bots without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">8. Account Termination</h2>
            <p>
              TaskBlitz reserves the right to suspend or terminate accounts that violate these terms. 
              Repeated violations, fraud, or abuse will result in permanent bans.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">9. Intellectual Property</h2>
            <p>
              Workers retain ownership of their work until payment is received. Upon payment, clients receive the agreed-upon 
              usage rights. TaskBlitz does not claim ownership of user-generated content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">10. Limitation of Liability</h2>
            <p className="mb-2">
              TaskBlitz is provided "as is" without warranties. We are not liable for:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Loss of funds due to user error or wallet compromise</li>
              <li>Disputes between users</li>
              <li>Quality of work completed</li>
              <li>Blockchain network issues or downtime</li>
              <li>Changes in cryptocurrency values</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">11. Tax Responsibilities</h2>
            <p>
              Users are responsible for reporting and paying taxes on their earnings according to their local laws. 
              TaskBlitz does not withhold taxes or provide tax advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">12. Changes to Terms</h2>
            <p>
              TaskBlitz reserves the right to modify these terms at any time. Users will be notified of significant changes. 
              Continued use of the platform constitutes acceptance of updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">13. Contact</h2>
            <p>
              For questions about these Terms of Service, contact us at:{' '}
              <a href="mailto:taskblitzclick@gmail.com" className="text-purple-400 hover:text-purple-300">
                taskblitzclick@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>    </main>
  )
}
