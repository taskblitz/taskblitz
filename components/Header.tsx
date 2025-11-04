'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link'
import { useEffect, useState } from 'react'


export function Header() {
  const { connected } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-white font-inter">TaskBlitz</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-text-secondary hover:text-white transition-colors">
              Browse Tasks
            </Link>
            {connected && (
              <>
                <Link href="/post-task" className="text-text-secondary hover:text-white transition-colors">
                  Post Task
                </Link>
                <Link href="/my-tasks" className="text-text-secondary hover:text-white transition-colors">
                  My Tasks
                </Link>
                <Link href="/dashboard" className="text-text-secondary hover:text-white transition-colors">
                  Dashboard
                </Link>
              </>
            )}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {connected && mounted && (
              <Link 
                href="/post-task"
                className="hidden sm:block post-task-button text-white font-semibold px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200"
              >
                Post Task
              </Link>
            )}
            {mounted ? (
              <div className="wallet-button-container">
                <WalletMultiButton />
              </div>
            ) : (
              <div className="gradient-primary text-white font-semibold px-4 py-2 rounded-lg">
                Connect Wallet
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}