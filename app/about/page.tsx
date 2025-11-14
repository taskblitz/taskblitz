import { Metadata } from 'next'
import { Header } from '@/components/Header'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About TaskBlitz - Our Mission & Vision',
  description: 'Learn about TaskBlitz, the decentralized micro-task marketplace built on Solana. Discover our mission to revolutionize freelance work with blockchain technology.',
  alternates: {
    canonical: 'https://taskblitz.com/about',
  },
}

export default function AboutPage() {
  // Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TaskBlitz",
    "url": "https://taskblitz.com",
    "logo": "https://taskblitz.com/logo.png",
    "description": "Decentralized micro-task marketplace powered by Solana blockchain",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/taskblitz",
      "https://github.com/taskblitz"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@taskblitz.com"
    }
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
            About TaskBlitz
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
            We're building the future of work - a decentralized micro-task marketplace where payments are instant, fees are fair, and trust is built on blockchain technology.
          </p>
        </div>

        {/* Mission Section */}
        <div className="glass-card p-8 rounded-xl mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Our Mission</h2>
          <p className="text-text-muted text-lg leading-relaxed mb-4">
            TaskBlitz exists to revolutionize the freelance and gig economy by leveraging blockchain technology. We believe that workers deserve instant payment, clients deserve transparency, and everyone deserves lower fees.
          </p>
          <p className="text-text-muted text-lg leading-relaxed">
            By building on Solana, we've created a platform where smart contracts handle payments automatically, reputation is permanently recorded on-chain, and geographic borders don't limit opportunity.
          </p>
        </div>

        {/* The Problem Section */}
        <div className="glass-card p-8 rounded-xl mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">The Problem We're Solving</h2>
          <div className="space-y-4 text-text-muted text-lg">
            <div className="flex items-start gap-3">
              <div className="text-red-400 text-2xl">❌</div>
              <div>
                <strong className="text-white">Slow Payments:</strong> Traditional platforms make workers wait 7-14 days for their money
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-red-400 text-2xl">❌</div>
              <div>
                <strong className="text-white">High Fees:</strong> Centralized platforms charge 20%+ in fees, eating into earnings
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-red-400 text-2xl">❌</div>
              <div>
                <strong className="text-white">Payment Fraud:</strong> Chargebacks and payment disputes leave workers unpaid
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-red-400 text-2xl">❌</div>
              <div>
                <strong className="text-white">Geographic Restrictions:</strong> Many platforms exclude workers from certain countries
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-red-400 text-2xl">❌</div>
              <div>
                <strong className="text-white">Fake Reviews:</strong> Reputation systems can be manipulated or deleted
              </div>
            </div>
          </div>
        </div>

        {/* Our Solution Section */}
        <div className="glass-card p-8 rounded-xl mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Our Solution</h2>
          <div className="space-y-4 text-text-muted text-lg">
            <div className="flex items-start gap-3">
              <div className="text-green-400 text-2xl">✓</div>
              <div>
                <strong className="text-white">Instant Payments:</strong> Get paid in seconds when tasks are approved, powered by Solana
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-400 text-2xl">✓</div>
              <div>
                <strong className="text-white">Fair Fees:</strong> Only 5% for workers, 2.5% for clients - no hidden charges
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-400 text-2xl">✓</div>
              <div>
                <strong className="text-white">Smart Contract Security:</strong> Payments locked in escrow, no chargebacks possible
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-400 text-2xl">✓</div>
              <div>
                <strong className="text-white">Global Access:</strong> Anyone with a Solana wallet can participate, anywhere
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-400 text-2xl">✓</div>
              <div>
                <strong className="text-white">Immutable Reputation:</strong> Reviews stored on blockchain, can't be faked or deleted
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="glass-card p-8 rounded-xl mb-8">
          <h2 className="text-3xl font-bold mb-6 text-white">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-purple-400">🔓 Decentralization</h3>
              <p className="text-text-muted">
                No single entity controls TaskBlitz. Smart contracts handle payments, and blockchain ensures transparency.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-cyan-400">⚡ Speed</h3>
              <p className="text-text-muted">
                Solana's high-speed blockchain enables instant payments and real-time updates.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-purple-400">🤝 Fairness</h3>
              <p className="text-text-muted">
                Low fees, transparent pricing, and equal access for everyone, everywhere.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-cyan-400">🔒 Security</h3>
              <p className="text-text-muted">
                Smart contract escrow protects both clients and workers from fraud.
              </p>
            </div>
          </div>
        </div>

        {/* Why Solana Section */}
        <div className="glass-card p-8 rounded-xl mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Why Solana?</h2>
          <p className="text-text-muted text-lg leading-relaxed mb-4">
            We chose Solana as our blockchain for several critical reasons:
          </p>
          <ul className="space-y-3 text-text-muted text-lg">
            <li className="flex items-start gap-3">
              <span className="text-purple-400">•</span>
              <span><strong className="text-white">Speed:</strong> Transactions confirm in seconds, not minutes or hours</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400">•</span>
              <span><strong className="text-white">Low Costs:</strong> Transaction fees are fractions of a cent</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400">•</span>
              <span><strong className="text-white">Scalability:</strong> Can handle thousands of tasks simultaneously</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400">•</span>
              <span><strong className="text-white">Ecosystem:</strong> Growing community and excellent developer tools</span>
            </li>
          </ul>
        </div>

        {/* Roadmap Section */}
        <div className="glass-card p-8 rounded-xl mb-8">
          <h2 className="text-3xl font-bold mb-6 text-white">Roadmap</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-green-400 pl-6">
              <h3 className="text-xl font-semibold mb-2 text-green-400">✓ Phase 1: MVP Launch (Completed)</h3>
              <ul className="text-text-muted space-y-1">
                <li>• Core marketplace functionality</li>
                <li>• Smart contract escrow system</li>
                <li>• USDC payments on Solana</li>
                <li>• User profiles and ratings</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-400 pl-6">
              <h3 className="text-xl font-semibold mb-2 text-purple-400">🔄 Phase 2: Growth (In Progress)</h3>
              <ul className="text-text-muted space-y-1">
                <li>• Advanced search and filtering</li>
                <li>• Dispute resolution system</li>
                <li>• Mobile app development</li>
                <li>• Multi-language support</li>
              </ul>
            </div>
            <div className="border-l-4 border-cyan-400 pl-6">
              <h3 className="text-xl font-semibold mb-2 text-cyan-400">🚀 Phase 3: Scale (Coming Soon)</h3>
              <ul className="text-text-muted space-y-1">
                <li>• Team collaboration features</li>
                <li>• Subscription plans for power users</li>
                <li>• API for third-party integrations</li>
                <li>• DAO governance token</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="glass-card p-8 rounded-xl mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Get in Touch</h2>
          <p className="text-text-muted text-lg mb-6">
            We're always happy to hear from our community. Whether you have questions, feedback, or just want to say hello, reach out to us:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="mailto:support@taskblitz.com" className="flex items-center gap-3 p-4 glass-card rounded-lg hover:border-purple-400 transition-colors">
              <span className="text-2xl">📧</span>
              <div>
                <div className="font-semibold text-white">Email</div>
                <div className="text-text-muted text-sm">support@taskblitz.com</div>
              </div>
            </a>
            <a href="https://twitter.com/taskblitz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 glass-card rounded-lg hover:border-cyan-400 transition-colors">
              <span className="text-2xl">🐦</span>
              <div>
                <div className="font-semibold text-white">Twitter</div>
                <div className="text-text-muted text-sm">@taskblitz</div>
              </div>
            </a>
            <a href="https://github.com/taskblitz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 glass-card rounded-lg hover:border-cyan-400 transition-colors">
              <span className="text-2xl">💻</span>
              <div>
                <div className="font-semibold text-white">GitHub</div>
                <div className="text-text-muted text-sm">Open source code</div>
              </div>
            </a>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center glass-card p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Ready to join the future of work?</h2>
          <p className="text-text-muted mb-6">
            Start earning or hiring on TaskBlitz today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary">
              Browse Tasks
            </Link>
            <Link href="/docs/getting-started" className="btn-secondary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
