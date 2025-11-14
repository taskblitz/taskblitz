'use client'
import { Header } from '@/components/Header'
import Link from 'next/link'

export default function FeesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Fee Structure
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          Transparent pricing with no hidden fees
        </p>

        {/* Platform Fee */}
        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Platform Fee</h2>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6 mb-4">
            <div className="text-center">
              <p className="text-text-secondary mb-2">TaskBlitz charges a simple</p>
              <p className="text-6xl font-bold text-purple-400 mb-2">10%</p>
              <p className="text-text-secondary">platform fee (added to task cost)</p>
            </div>
          </div>

          <div className="bg-black/30 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 text-white">Example Breakdown:</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
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
              Workers receive 100% of the posted reward. The 10% fee is added to the client's cost.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 glass-card p-8 text-center bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
          <h2 className="text-2xl font-bold mb-4">Ready to Save on Fees?</h2>
          <p className="text-text-secondary mb-6">
            Join TaskBlitz today and keep more of your earnings
          </p>
          <Link href="/" className="btn-primary inline-block">
            Get Started
          </Link>
        </div>
      </div>    </main>
  )
}
