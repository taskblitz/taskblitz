'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, ChevronDown, LayoutDashboard, ListTodo, MessageSquare } from 'lucide-react'


export function Header() {
  const { connected } = useWallet()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <>
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="flex flex-col hover:opacity-80 transition-opacity">
              <span className="text-xl md:text-xl font-bold text-white font-inter">TaskBlitz</span>
              <span className="hidden md:block text-xs text-text-secondary">Complete micro-tasks & earn crypto instantly</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-text-secondary hover:text-white transition-colors">
                Browse Tasks
              </Link>
              <Link href="/developers" className="text-text-secondary hover:text-white transition-colors flex items-center gap-1">
                <span>🤖</span>
                <span>Developers</span>
              </Link>
              {connected && (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                    className="text-text-secondary hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>My Account</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute top-full mt-2 right-0 w-56 glass-card border border-purple-500/30 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Account</p>
                      </div>
                      <Link 
                        href="/dashboard" 
                        className="flex items-center gap-3 text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-cyan-500/20 transition-all py-3 px-4 group"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                        <span>Dashboard</span>
                      </Link>
                      <Link 
                        href="/my-tasks" 
                        className="flex items-center gap-3 text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-cyan-500/20 transition-all py-3 px-4 group"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ListTodo className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                        <span>My Tasks</span>
                      </Link>
                      <div className="border-t border-white/10 my-2" />
                      <Link 
                        href="/feedback" 
                        className="flex items-center gap-3 text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-cyan-500/20 transition-all py-3 px-4 group"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                        <span>Feedback</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Right Side - Wallet + Mobile Menu */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {connected && mounted && (
                <Link 
                  href="/post-task"
                  className="hidden sm:block post-task-button text-white font-semibold px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg hover:scale-105 transition-all duration-200"
                >
                  Post Task
                </Link>
              )}
              {mounted ? (
                <div className="wallet-button-container scale-90 md:scale-100">
                  <WalletMultiButton />
                </div>
              ) : (
                <div className="gradient-primary text-white font-semibold px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg">
                  Connect Wallet
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-14 right-4 w-48 glass-card border border-white/20 rounded-lg shadow-xl z-50 md:hidden">
            <nav className="flex flex-col py-2">
              <Link 
                href="/" 
                className="text-white hover:bg-white/10 transition-colors py-2.5 px-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Tasks
              </Link>
              <Link 
                href="/developers" 
                className="text-white hover:bg-white/10 transition-colors py-2.5 px-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                🤖 Developers
              </Link>
              {connected && (
                <>
                  <Link 
                    href="/post-task" 
                    className="text-white hover:bg-white/10 transition-colors py-2.5 px-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Post Task
                  </Link>
                  <Link 
                    href="/my-tasks" 
                    className="text-white hover:bg-white/10 transition-colors py-2.5 px-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Tasks
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="text-white hover:bg-white/10 transition-colors py-2.5 px-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/feedback" 
                    className="text-white hover:bg-white/10 transition-colors py-2.5 px-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Feedback
                  </Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  )
}