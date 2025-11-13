'use client'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { Wallet, Zap, CheckCircle } from 'lucide-react'

export default function GettingStartedPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/docs" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">
          ← Back to Documentation
        </Link>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Getting Started with TaskBlitz
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          Start earning or posting tasks in just a few minutes
        </p>

        {/* Step 1 */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Step 1: Connect Your Wallet</h2>
              <p className="text-text-secondary mb-4">
                TaskBlitz uses Solana wallets to handle payments securely. You'll need a wallet to get started.
              </p>
              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-purple-400">Recommended Wallets:</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• <strong>Phantom</strong> - Most popular, beginner-friendly</li>
                  <li>• <strong>Solflare</strong> - Feature-rich, great for power users</li>
                  <li>• <strong>Backpack</strong> - Modern interface, built for web3</li>
                </ul>
              </div>
              <p className="text-text-secondary text-sm">
                Click "Connect Wallet" in the top right corner and follow the prompts. Your wallet will ask you to approve the connection.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Step 2: Get Some Crypto</h2>
              <p className="text-text-secondary mb-4">
                <strong>For Workers:</strong> You don't need any crypto to start! Just complete tasks and earn USDC.
              </p>
              <p className="text-text-secondary mb-4">
                <strong>For Clients:</strong> You'll need USDC to pay for tasks. You can buy USDC on exchanges like Coinbase, Kraken, or directly through your wallet.
              </p>
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-cyan-400">Pro Tip:</h3>
                <p className="text-sm text-text-secondary">
                  Keep a small amount of SOL in your wallet (around 0.01 SOL or $2) for transaction fees. Solana fees are tiny - usually less than $0.01 per transaction!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Step 3: Start Using TaskBlitz</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-purple-400">As a Worker:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-text-secondary text-sm">
                    <li>Browse available tasks on the marketplace</li>
                    <li>Click "Apply" on tasks you want to complete</li>
                    <li>Complete the work and submit your proof</li>
                    <li>Get paid instantly when approved!</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-cyan-400">As a Client:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-text-secondary text-sm">
                    <li>Click "Post Task" in the header</li>
                    <li>Fill in task details and set your reward</li>
                    <li>Funds are locked in escrow for security</li>
                    <li>Review submissions and approve good work</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/docs/how-it-works" className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <h3 className="font-semibold mb-2">Learn How It Works</h3>
              <p className="text-text-secondary text-sm">Understand the complete task lifecycle</p>
            </Link>
            <Link href="/docs/security" className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <h3 className="font-semibold mb-2">Security & Escrow</h3>
              <p className="text-text-secondary text-sm">How we protect your funds</p>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
