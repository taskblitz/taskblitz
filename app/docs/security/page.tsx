'use client'
import { Header } from '@/components/Header'
import Link from 'next/link'
import { Shield, Lock, Key, AlertTriangle, CheckCircle } from 'lucide-react'

export default function SecurityPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/docs" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">
          ← Back to Documentation
        </Link>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Security & Escrow
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          How TaskBlitz protects your funds and ensures fair transactions
        </p>

        {/* Smart Contract Escrow */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Smart Contract Escrow</h2>
              <p className="text-text-secondary mb-4">
                All task payments are secured by Solana smart contracts. When a client posts a task, the payment is immediately locked in escrow and cannot be withdrawn by anyone until the work is completed and approved.
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-purple-400">How It Works:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary">
                  <li>Client posts task and payment locks in smart contract</li>
                  <li>Worker applies and completes the task</li>
                  <li>Worker submits proof of completion</li>
                  <li>Client reviews and approves the work</li>
                  <li>Smart contract automatically releases payment to worker</li>
                </ol>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-400 mb-1">100% Secure</h4>
                    <p className="text-sm text-text-secondary">
                      Funds are protected by blockchain technology. No one can access the money until both parties agree the work is complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Security */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Key className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Wallet Security</h2>
              <p className="text-text-secondary mb-4">
                Your wallet is your identity on TaskBlitz. Keep it secure with these best practices:
              </p>
              
              <div className="space-y-3">
                <div className="bg-black/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-cyan-400">✅ Do:</h3>
                  <ul className="space-y-1 text-sm text-text-secondary">
                    <li>• Use a hardware wallet for large amounts</li>
                    <li>• Keep your seed phrase offline and secure</li>
                    <li>• Use a separate wallet for daily tasks</li>
                    <li>• Enable wallet password protection</li>
                    <li>• Verify transaction details before signing</li>
                  </ul>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-red-400">❌ Don't:</h3>
                  <ul className="space-y-1 text-sm text-text-secondary">
                    <li>• Never share your seed phrase with anyone</li>
                    <li>• Don't store seed phrases digitally</li>
                    <li>• Never enter seed phrase on websites</li>
                    <li>• Don't use the same wallet for everything</li>
                    <li>• Never screenshot your seed phrase</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dispute Resolution */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Dispute Resolution</h2>
              <p className="text-text-secondary mb-4">
                If there's a disagreement about task completion, either party can open a dispute. Our admin team will review the evidence and make a fair decision.
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-purple-400">Dispute Process:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary">
                  <li>Either party opens a dispute with evidence</li>
                  <li>Both parties can submit additional information</li>
                  <li>Admin team reviews all evidence objectively</li>
                  <li>Decision is made within 48-72 hours</li>
                  <li>Funds are released according to the decision</li>
                </ol>
              </div>

              <p className="text-sm text-text-secondary">
                <strong>Important:</strong> During a dispute, funds remain locked in escrow. Neither party can access them until the dispute is resolved.
              </p>
            </div>
          </div>
        </div>

        {/* Anti-Fraud Measures */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Anti-Fraud Protection</h2>
              <p className="text-text-secondary mb-4">
                TaskBlitz uses multiple layers of protection to prevent fraud and abuse:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-purple-400">Reputation System</h3>
                  <p className="text-sm text-text-secondary">
                    Users build reputation through completed tasks. Low reputation users face restrictions.
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-cyan-400">Wallet Verification</h3>
                  <p className="text-sm text-text-secondary">
                    All transactions are tied to verified Solana wallets, creating accountability.
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-purple-400">Rate Limiting</h3>
                  <p className="text-sm text-text-secondary">
                    Automated systems prevent spam and abuse through intelligent rate limiting.
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-cyan-400">Admin Monitoring</h3>
                  <p className="text-sm text-text-secondary">
                    Our team actively monitors for suspicious activity and takes action quickly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Security */}
        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Transaction Security</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-purple-400">Blockchain Transparency</h3>
              <p className="text-text-secondary text-sm">
                Every transaction is recorded on the Solana blockchain. You can verify any payment using the transaction hash on Solscan.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-cyan-400">Low Transaction Fees</h3>
              <p className="text-text-secondary text-sm">
                Solana's low fees (typically less than $0.01) mean you keep more of your earnings. No hidden fees or surprise charges.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-purple-400">Instant Settlements</h3>
              <p className="text-text-secondary text-sm">
                Once approved, payments are instant. No waiting days for bank transfers or payment processors.
              </p>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4">Security Tips</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-purple-400">For Workers:</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• Only apply to tasks from reputable clients</li>
                <li>• Keep proof of all completed work</li>
                <li>• Communicate through the platform</li>
                <li>• Report suspicious tasks immediately</li>
                <li>• Never share personal information</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-cyan-400">For Clients:</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• Check worker reputation before accepting</li>
                <li>• Provide clear task requirements</li>
                <li>• Review work thoroughly before approving</li>
                <li>• Report low-quality work</li>
                <li>• Use escrow for all payments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>    </main>
  )
}
