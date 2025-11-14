import { Metadata } from 'next'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'Changelog - TaskBlitz Updates & Improvements',
  description: 'Stay updated with the latest TaskBlitz features, improvements, and bug fixes. See how we\'re continuously improving the Solana micro-task marketplace.',
  alternates: {
    canonical: 'https://taskblitz.com/changelog',
  },
}

const changelog = [
  {
    version: "1.3.0",
    date: "November 2024",
    type: "feature",
    items: [
      "Added comprehensive SEO optimization for better search visibility",
      "Implemented FAQ page with structured data for rich snippets",
      "Created About page showcasing mission and values",
      "Added sitemap and robots.txt for search engine crawling",
      "Enhanced metadata across all pages for better social sharing"
    ]
  },
  {
    version: "1.2.0",
    date: "November 2024",
    type: "feature",
    items: [
      "Launched advanced analytics dashboard for users",
      "Added bulk task posting capabilities",
      "Implemented task templates for recurring work",
      "Created API access for developers",
      "Added webhook support for real-time notifications"
    ]
  },
  {
    version: "1.1.0",
    date: "October 2024",
    type: "feature",
    items: [
      "Introduced comprehensive admin panel",
      "Added dispute resolution system",
      "Implemented anti-fraud detection",
      "Enhanced notification system with real-time updates",
      "Added file upload support for task submissions"
    ]
  },
  {
    version: "1.0.5",
    date: "October 2024",
    type: "improvement",
    items: [
      "Improved mobile responsiveness across all pages",
      "Optimized dashboard loading performance",
      "Enhanced search and filtering capabilities",
      "Updated UI with better glassmorphism effects",
      "Improved wallet connection stability"
    ]
  },
  {
    version: "1.0.0",
    date: "September 2024",
    type: "feature",
    items: [
      "🎉 Official TaskBlitz MVP launch",
      "Core marketplace functionality with task posting and browsing",
      "Smart contract escrow system on Solana",
      "USDC payment integration",
      "User profiles with reputation system",
      "Rating and review system",
      "Transaction history tracking",
      "Comprehensive documentation"
    ]
  },
  {
    version: "0.9.0",
    date: "September 2024",
    type: "feature",
    items: [
      "Beta testing phase with selected users",
      "Implemented X402 payment protocol",
      "Added blockchain transaction verification",
      "Created developer documentation",
      "Security audit and smart contract testing"
    ]
  },
  {
    version: "0.5.0",
    date: "August 2024",
    type: "feature",
    items: [
      "Alpha release for internal testing",
      "Basic task posting and completion flow",
      "Wallet integration with Phantom and Solflare",
      "Initial smart contract deployment on Devnet",
      "Core UI/UX design implementation"
    ]
  }
]

export default function ChangelogPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
            Changelog
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Track our journey as we continuously improve TaskBlitz. Every update brings us closer to the perfect micro-task marketplace.
          </p>
        </div>

        {/* Changelog Timeline */}
        <div className="space-y-8">
          {changelog.map((release, index) => (
            <div key={index} className="glass-card p-6 rounded-xl">
              {/* Release Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">
                      Version {release.version}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      release.type === 'feature' 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {release.type === 'feature' ? '✨ New Features' : '🔧 Improvements'}
                    </span>
                  </div>
                  <p className="text-text-muted">{release.date}</p>
                </div>
              </div>

              {/* Release Items */}
              <ul className="space-y-2">
                {release.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3 text-text-muted">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center glass-card p-6 rounded-xl">
          <p className="text-text-muted">
            Have a feature request or found a bug? 
            <a href="mailto:support@taskblitz.com" className="text-purple-400 hover:text-purple-300 ml-1">
              Let us know
            </a>
          </p>
        </div>

        {/* Subscribe Section */}
        <div className="mt-8 text-center glass-card p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-text-muted mb-6">
            Follow us on social media to get notified about new features and updates
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="https://twitter.com/taskblitz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Follow on Twitter
            </a>
            <a 
              href="https://discord.gg/taskblitz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
