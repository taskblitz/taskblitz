'use client'
import { Header } from '@/components/Header'
import Link from 'next/link'
import { FileText, Zap, Shield, DollarSign, Users, Code, TrendingUp, Bell } from 'lucide-react'

export default function DocsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            TaskBlitz Documentation
          </h1>
          <p className="text-text-secondary text-lg">
            Everything you need to know about using TaskBlitz
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link href="/docs/getting-started" className="glass-card p-6 hover:border-purple-400/50 transition-all group">
            <Zap className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">Getting Started</h3>
            <p className="text-text-secondary text-sm">Connect your wallet and start earning or posting tasks in minutes</p>
          </Link>

          <Link href="/docs/how-it-works" className="glass-card p-6 hover:border-cyan-400/50 transition-all group">
            <FileText className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors">How It Works</h3>
            <p className="text-text-secondary text-sm">Understand the task lifecycle from posting to payment</p>
          </Link>

          <Link href="/docs/security" className="glass-card p-6 hover:border-purple-400/50 transition-all group">
            <Shield className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">Security & Escrow</h3>
            <p className="text-text-secondary text-sm">Learn how we protect your funds with smart contract escrow</p>
          </Link>

          <Link href="/docs/payments" className="glass-card p-6 hover:border-cyan-400/50 transition-all group">
            <DollarSign className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors">Payments & Fees</h3>
            <p className="text-text-secondary text-sm">Understand our fee structure and payment processing</p>
          </Link>

          <Link href="/docs/for-workers" className="glass-card p-6 hover:border-purple-400/50 transition-all group">
            <Users className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">For Workers</h3>
            <p className="text-text-secondary text-sm">Tips and best practices for completing tasks and maximizing earnings</p>
          </Link>

          <Link href="/docs/for-clients" className="glass-card p-6 hover:border-cyan-400/50 transition-all group">
            <TrendingUp className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors">For Clients</h3>
            <p className="text-text-secondary text-sm">How to post effective tasks and manage your projects</p>
          </Link>

          <Link href="/docs/advanced-features" className="glass-card p-6 hover:border-purple-400/50 transition-all group">
            <Bell className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">Advanced Features</h3>
            <p className="text-text-secondary text-sm">Task templates, bulk creation, webhooks, and analytics</p>
          </Link>

          <Link href="/developers" className="glass-card p-6 hover:border-cyan-400/50 transition-all group">
            <Code className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors">API Documentation</h3>
            <p className="text-text-secondary text-sm">Integrate TaskBlitz payments into your application</p>
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-400">What is TaskBlitz?</h3>
              <p className="text-text-secondary">
                TaskBlitz is a decentralized micro-task marketplace built on Solana. It connects people who need work done (clients) with people who want to earn crypto (workers). All payments are instant and secured by blockchain technology.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Do I need crypto to use TaskBlitz?</h3>
              <p className="text-text-secondary">
                Workers don't need any crypto to start - you'll earn USDC by completing tasks. Clients need USDC to post tasks and pay workers. You'll also need a small amount of SOL for transaction fees (usually less than $0.01 per transaction).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-400">How does escrow work?</h3>
              <p className="text-text-secondary">
                When a client posts a task, the payment is locked in a smart contract escrow. The funds can't be withdrawn by anyone until the task is completed and approved. This protects both workers (guaranteed payment) and clients (work must be completed).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-400">What are the fees?</h3>
              <p className="text-text-secondary">
                TaskBlitz charges a 10% platform fee, added to the task cost. Workers receive 100% of the posted reward. For example, if a task pays $100, the worker gets $100 and the client pays $110. Solana transaction costs are minimal (typically under $0.01).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-400">How fast are payments?</h3>
              <p className="text-text-secondary">
                Payments are instant! Once a client approves your work, the USDC is transferred to your wallet within seconds. This is one of the key advantages of building on Solana.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-400">What if there's a dispute?</h3>
              <p className="text-text-secondary">
                If a client and worker can't agree on task completion, either party can open a dispute. Our admin team will review the evidence and make a fair decision. The escrow ensures funds stay protected during the dispute process.
              </p>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="mt-12 text-center glass-card p-8">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-text-secondary mb-6">
            Our support team is here to help
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/feedback" className="btn-primary">
              Contact Support
            </Link>
          </div>
        </div>
      </div>    </main>
  )
}
