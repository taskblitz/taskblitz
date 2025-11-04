'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link'
import { ArrowRight, Zap, DollarSign, Globe } from 'lucide-react'

export function Hero() {
  const { connected } = useWallet()

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-8">
            <Zap className="w-4 h-4 text-cyan-400 mr-2" />
            <span className="text-sm font-medium">Built on Solana • Instant Payments</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            The First{' '}
            <span className="gradient-text">Crypto-Native</span>
            <br />
            Micro-Task Marketplace
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto">
            Post tasks, complete work, get paid instantly in crypto. 
            <br className="hidden sm:block" />
            <strong className="text-white">10% fees</strong> vs MTurk&apos;s 40%. <strong className="text-white">Instant payments</strong> vs 7+ day delays.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {connected ? (
              <>
                <Link 
                  href="/marketplace"
                  className="gradient-primary text-white font-semibold px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-lg hover:shadow-purple-500/50 flex items-center"
                >
                  Browse Tasks <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link 
                  href="/post-task"
                  className="glass-card border-white/20 text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-all flex items-center"
                >
                  Post a Task
                </Link>
              </>
            ) : (
              <>
                <WalletMultiButton />
                <Link 
                  href="/marketplace"
                  className="text-purple-400 hover:text-purple-300 hover:underline transition-colors flex items-center"
                >
                  View Marketplace <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Key benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass-card p-6 text-center">
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Instant Payments</h3>
              <p className="text-text-secondary">Get paid immediately when work is approved. No 7+ day delays.</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <Zap className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Low Fees</h3>
              <p className="text-text-secondary">Only 10% platform fee vs traditional platforms&apos; 20-40%.</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Global Access</h3>
              <p className="text-text-secondary">Anyone with a Solana wallet can participate. No geographic restrictions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}