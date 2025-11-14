import { Metadata } from 'next'
import { Header } from '@/components/Header'
import Link from 'next/link'
import { FileText, Users, CheckCircle, DollarSign, MessageCircle, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How TaskBlitz Works - Complete Guide',
  description: 'Learn how TaskBlitz works step-by-step. From posting tasks to instant USDC payments on Solana blockchain. Complete guide for clients and workers.',
  alternates: {
    canonical: 'https://taskblitz.com/docs/how-it-works',
  },
}

export default function HowItWorksPage() {
  // HowTo Schema for rich snippets
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use TaskBlitz - Complete Guide",
    "description": "Learn how to post tasks and earn USDC on TaskBlitz, the Solana-powered micro-task marketplace",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Connect Your Wallet",
        "text": "Connect your Solana wallet (Phantom, Solflare, etc.) to TaskBlitz. Your wallet is your identity - no email or password needed.",
        "url": "https://taskblitz.com/docs/getting-started"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Browse or Post Tasks",
        "text": "Browse available tasks in the marketplace or post your own task with a USDC payment. Funds are locked in smart contract escrow for security.",
        "url": "https://taskblitz.com/dashboard"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Complete the Work",
        "text": "Workers complete tasks and submit proof of completion. Clients review the work and can request revisions if needed.",
        "url": "https://taskblitz.com/docs/how-it-works"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Get Paid Instantly",
        "text": "Once approved, the smart contract automatically releases USDC payment to the worker's wallet in seconds. No waiting period.",
        "url": "https://taskblitz.com/docs/payments"
      }
    ],
    "totalTime": "PT5M"
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/docs" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">
          ← Back to Documentation
        </Link>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          How TaskBlitz Works
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          Understanding the complete task lifecycle from posting to payment
        </p>

        {/* Overview */}
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">The TaskBlitz Process</h2>
          <p className="text-text-secondary mb-6">
            TaskBlitz connects people who need work done (clients) with people who want to earn crypto (workers). 
            Every transaction is secured by blockchain technology and smart contract escrow.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-purple-400">For Clients</h3>
              <p className="text-sm text-text-secondary">
                Post tasks, set rewards, and get quality work completed quickly by skilled workers worldwide.
              </p>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-cyan-400">For Workers</h3>
              <p className="text-sm text-text-secondary">
                Browse tasks, complete work you're good at, and get paid instantly in USDC cryptocurrency.
              </p>
            </div>
          </div>
        </div>

        {/* Step by Step */}
        <h2 className="text-2xl font-bold mb-6">Step-by-Step Process</h2>

        {/* Step 1 */}
        <div className="glass-card p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-semibold">Client Posts Task</h3>
              </div>
              <p className="text-text-secondary mb-3">
                A client creates a task with a clear description, requirements, and reward amount. The payment is immediately locked in smart contract escrow.
              </p>
              <div className="bg-black/30 p-3 rounded text-sm text-text-secondary">
                <strong>Example:</strong> "Write a 500-word blog post about Solana DeFi" - Reward: $25 USDC
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-card p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-semibold">Worker Applies</h3>
              </div>
              <p className="text-text-secondary mb-3">
                Workers browse available tasks and click "Apply" on tasks they want to complete. They can ask questions before starting.
              </p>
              <div className="bg-black/30 p-3 rounded text-sm text-text-secondary">
                <strong>Tip:</strong> Workers with higher reputation scores are more likely to be accepted
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-card p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
              3
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-semibold">Client Accepts Worker</h3>
              </div>
              <p className="text-text-secondary mb-3">
                The client reviews applications and accepts a worker. The task status changes to "In Progress" and the worker can begin.
              </p>
              <div className="bg-black/30 p-3 rounded text-sm text-text-secondary">
                <strong>Note:</strong> Funds remain locked in escrow during this entire process
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="glass-card p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
              4
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-semibold">Worker Completes Task</h3>
              </div>
              <p className="text-text-secondary mb-3">
                The worker completes the task and submits proof of completion (link, file, or description). The client is notified to review.
              </p>
              <div className="bg-black/30 p-3 rounded text-sm text-text-secondary">
                <strong>Best Practice:</strong> Provide detailed proof and communicate throughout
              </div>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="glass-card p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
              5
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-semibold">Client Reviews Work</h3>
              </div>
              <p className="text-text-secondary mb-3">
                The client reviews the submitted work. If satisfied, they approve it. If not, they can request revisions or open a dispute.
              </p>
              <div className="bg-black/30 p-3 rounded text-sm text-text-secondary">
                <strong>Fair Play:</strong> Only approve if work meets the original requirements
              </div>
            </div>
          </div>
        </div>

        {/* Step 6 */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
              6
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <h3 className="text-xl font-semibold">Instant Payment</h3>
              </div>
              <p className="text-text-secondary mb-3">
                Once approved, the smart contract automatically releases payment to the worker. Money arrives in seconds!
              </p>
              <div className="bg-green-500/10 border border-green-500/20 p-3 rounded text-sm">
                <strong className="text-green-400">Success!</strong> Worker receives 100% of posted reward (10% fee paid by client)
              </div>
            </div>
          </div>
        </div>

        {/* Task States */}
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Task States</h2>
          <p className="text-text-secondary mb-6">
            Every task goes through different states during its lifecycle:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <div>
                <strong className="text-blue-400">Open</strong>
                <span className="text-text-secondary text-sm ml-2">- Task is available for workers to apply</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div>
                <strong className="text-yellow-400">In Progress</strong>
                <span className="text-text-secondary text-sm ml-2">- Worker is completing the task</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
              <div>
                <strong className="text-purple-400">Under Review</strong>
                <span className="text-text-secondary text-sm ml-2">- Client is reviewing submitted work</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div>
                <strong className="text-green-400">Completed</strong>
                <span className="text-text-secondary text-sm ml-2">- Work approved and payment sent</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div>
                <strong className="text-red-400">Disputed</strong>
                <span className="text-text-secondary text-sm ml-2">- Disagreement being resolved by admins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-purple-400">⚡ Instant Payments</h3>
              <p className="text-sm text-text-secondary">
                Get paid in seconds, not days. Blockchain technology enables instant settlements.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-cyan-400">🔒 Escrow Protection</h3>
              <p className="text-sm text-text-secondary">
                Funds are locked in smart contracts. Both parties are protected throughout the process.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-purple-400">🌐 Global Access</h3>
              <p className="text-sm text-text-secondary">
                Work from anywhere, pay anyone. No banks or borders required.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-cyan-400">💰 Transparent Fees</h3>
              <p className="text-sm text-text-secondary">
                10% platform fee added to client cost. Workers get 100% of posted reward. Solana transaction fees are less than $0.01.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-purple-400">⭐ Reputation System</h3>
              <p className="text-sm text-text-secondary">
                Build trust through completed tasks. Higher reputation = more opportunities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-cyan-400">🛡️ Dispute Resolution</h3>
              <p className="text-sm text-text-secondary">
                Fair resolution process if disagreements arise. Funds stay protected.
              </p>
            </div>
          </div>
        </div>
      </div>    </main>
  )
}
