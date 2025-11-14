'use client'
import { Header } from '@/components/Header'
import Link from 'next/link'
import { DollarSign, TrendingDown, Zap, CreditCard } from 'lucide-react'

export default function PaymentsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/docs" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">
          ← Back to Documentation
        </Link>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Payments & Fees
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          Understanding TaskBlitz's transparent fee structure
        </p>

        {/* Fee Structure */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Platform Fee</h2>
              <p className="text-text-secondary mb-4">
                TaskBlitz charges a simple, transparent 10% platform fee. The fee is added to the task cost, so workers receive 100% of the posted reward.
              </p>
              
              <div className="bg-black/30 p-6 rounded-lg mb-4">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-text-muted text-sm mb-1">Worker Gets</p>
                    <p className="text-3xl font-bold text-green-400">$100</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-sm mb-1">Platform Fee (10%)</p>
                    <p className="text-3xl font-bold text-purple-400">+$10</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-sm mb-1">Client Pays</p>
                    <p className="text-3xl font-bold text-white">$110</p>
                  </div>
                </div>
                <p className="text-center text-sm text-text-secondary mt-4">
                  Workers get exactly what's advertised. Clients pay the reward + 10% fee.
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h3 className="font-semibold text-green-400 mb-2">No Hidden Fees</h3>
                <p className="text-sm text-text-secondary">
                  What you see is what you get. No surprise charges, no withdrawal fees, no monthly subscriptions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Fees */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Blockchain Transaction Fees</h2>
              <p className="text-text-secondary mb-4">
                Solana blockchain charges tiny fees for processing transactions. These go to network validators, not TaskBlitz.
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-cyan-400">Typical Costs:</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• Posting a task: ~$0.005 (half a cent)</li>
                  <li>• Accepting a worker: ~$0.005</li>
                  <li>• Completing a task: ~$0.005</li>
                  <li>• Approving work: ~$0.005</li>
                </ul>
              </div>

              <p className="text-sm text-text-secondary">
                <strong>Total transaction costs per task:</strong> Usually less than $0.02 (2 cents) for the entire lifecycle.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Payment Currency</h2>
              <p className="text-text-secondary mb-4">
                All payments on TaskBlitz are made in USDC (USD Coin), a stablecoin pegged 1:1 to the US Dollar.
              </p>
              
              <div className="space-y-4">
                <div className="bg-black/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-purple-400">Why USDC?</h3>
                  <ul className="space-y-1 text-sm text-text-secondary">
                    <li>• Stable value (always $1 = 1 USDC)</li>
                    <li>• No crypto volatility</li>
                    <li>• Easy to convert to regular money</li>
                    <li>• Widely accepted</li>
                  </ul>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-cyan-400">How to Get USDC:</h3>
                  <ul className="space-y-1 text-sm text-text-secondary">
                    <li>• Buy on exchanges (Coinbase, Kraken, Binance)</li>
                    <li>• Purchase directly in your wallet (Phantom, Solflare)</li>
                    <li>• Earn by completing tasks on TaskBlitz</li>
                    <li>• Convert from other cryptocurrencies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Speed */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Payment Speed</h2>
              <p className="text-text-secondary mb-4">
                One of TaskBlitz's biggest advantages is instant payments powered by Solana blockchain.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-400 mb-2">TaskBlitz (Solana)</h3>
                  <p className="text-3xl font-bold mb-1">~2 seconds</p>
                  <p className="text-sm text-text-secondary">From approval to wallet</p>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-400 mb-2">Traditional Platforms</h3>
                  <p className="text-3xl font-bold mb-1">3-7 days</p>
                  <p className="text-sm text-text-secondary">Bank transfer delays</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Fee Comparison</h2>
          <p className="text-text-secondary mb-6">
            See how TaskBlitz compares to other freelance platforms:
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4">Platform</th>
                  <th className="text-left py-3 px-4">Fee</th>
                  <th className="text-left py-3 px-4">Payment Speed</th>
                  <th className="text-left py-3 px-4">Withdrawal Fee</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                <tr className="border-b border-white/5 bg-green-500/5">
                  <td className="py-3 px-4 font-semibold text-green-400">TaskBlitz</td>
                  <td className="py-3 px-4">10%</td>
                  <td className="py-3 px-4">Instant</td>
                  <td className="py-3 px-4">$0</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4">Upwork</td>
                  <td className="py-3 px-4">10-20%</td>
                  <td className="py-3 px-4">3-7 days</td>
                  <td className="py-3 px-4">$1-3</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4">Fiverr</td>
                  <td className="py-3 px-4">20%</td>
                  <td className="py-3 px-4">14 days</td>
                  <td className="py-3 px-4">$1-3</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4">Freelancer</td>
                  <td className="py-3 px-4">10%</td>
                  <td className="py-3 px-4">3-15 days</td>
                  <td className="py-3 px-4">$1-5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4">Payment FAQ</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-purple-400">When do I get paid?</h3>
              <p className="text-sm text-text-secondary">
                Instantly when the client approves your work. The smart contract automatically releases payment to your wallet within seconds.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-cyan-400">Can I withdraw to my bank account?</h3>
              <p className="text-sm text-text-secondary">
                Yes! Convert USDC to regular money on exchanges like Coinbase or Kraken, then withdraw to your bank. Most exchanges process withdrawals in 1-3 business days.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-purple-400">What if I don't have SOL for transaction fees?</h3>
              <p className="text-sm text-text-secondary">
                You'll need a small amount of SOL (~$2 worth) to pay for transaction fees. Buy it on any exchange or ask a friend to send you some.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-cyan-400">Are there any refunds?</h3>
              <p className="text-sm text-text-secondary">
                If work isn't completed or doesn't meet requirements, clients can request a refund through the dispute system. Admins review and make fair decisions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-purple-400">Do I need to pay taxes?</h3>
              <p className="text-sm text-text-secondary">
                Yes, you're responsible for reporting and paying taxes on your earnings according to your local laws. TaskBlitz doesn't withhold taxes.
              </p>
            </div>
          </div>
        </div>
      </div>    </main>
  )
}
