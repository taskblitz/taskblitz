'use client'
import Link from 'next/link'
import { Twitter, Github, MessageCircle, FileText, Code, Shield, HelpCircle, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex flex-col mb-4">
              <span className="text-2xl font-bold text-white">TaskBlitz</span>
              <span className="text-sm text-text-secondary mt-1">Solana Micro-Task Marketplace</span>
            </Link>
            <p className="text-text-muted text-sm mb-4">
              Complete tasks, earn crypto instantly. Built on Solana for lightning-fast payments.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/taskblitz" target="_blank" rel="noopener noreferrer" 
                className="text-text-secondary hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com/taskblitz/x402-sdk" target="_blank" rel="noopener noreferrer"
                className="text-text-secondary hover:text-purple-400 transition-colors"
                title="X402 Payment SDK">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://discord.gg/taskblitz" target="_blank" rel="noopener noreferrer"
                className="text-text-secondary hover:text-purple-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-text-secondary hover:text-white transition-colors text-sm flex items-center gap-2">
                  Browse Tasks
                </Link>
              </li>
              <li>
                <Link href="/post-task" className="text-text-secondary hover:text-white transition-colors text-sm">
                  Post a Task
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-text-secondary hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/transactions" className="text-text-secondary hover:text-white transition-colors text-sm">
                  Transactions
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-text-secondary hover:text-white transition-colors text-sm">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-text-secondary hover:text-white transition-colors text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-text-secondary hover:text-white transition-colors text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-text-secondary hover:text-white transition-colors text-sm">
                  About TaskBlitz
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-text-secondary hover:text-white transition-colors text-sm">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="/developers" className="text-text-secondary hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  API & Developers
                </Link>
              </li>
              <li>
                <Link href="/docs/security" className="text-text-secondary hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security & Escrow
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-text-secondary hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-text-secondary hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/fees" className="text-text-secondary hover:text-white transition-colors text-sm">
                  Fee Structure
                </Link>
              </li>
              <li>
                <a href="mailto:taskblitzclick@gmail.com" className="text-text-secondary hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-muted text-sm">
            © {currentYear} TaskBlitz. Built on Solana. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="text-text-muted text-xs">Powered by</span>
            <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
              Solana
            </a>
            <span className="text-text-muted">•</span>
            <a href="https://www.circle.com/en/usdc" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
              USDC
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
