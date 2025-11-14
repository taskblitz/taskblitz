'use client'
import { Header } from '@/components/Header'
import Link from 'next/link'

export default function ForWorkersPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/docs" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">
          ← Back to Documentation
        </Link>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Guide for Workers
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          Tips and best practices for maximizing your earnings on TaskBlitz
        </p>

        {/* Getting Started */}
        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-3 text-text-secondary">
            <li>Connect your Solana wallet (Phantom, Solflare, or Backpack)</li>
            <li>Browse available tasks on the homepage</li>
            <li>Click "Apply" on tasks that match your skills</li>
            <li>Complete the work and submit proof</li>
            <li>Get paid instantly when approved!</li>
          </ol>
        </div>

        {/* Finding Tasks */}
        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Finding the Right Tasks</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-purple-400">Use Filters</h3>
              <p className="text-sm text-text-secondary">
                Filter by category, difficulty, and reward range to find tasks that match your skills and pay expectations.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-cyan-400">Check Client Reputation</h3>
              <p className="text-sm text-text-secondary">
                Look for clients with high ratings and completed tasks. They're more likely to approve good work quickly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-purple-400">Read Requirements Carefully</h3>
              <p className="text-sm text-text-secondary">
                Make sure you understand what's required before applying. Ask questions if anything is unclear.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-cyan-400">Start with Easy Tasks</h3>
              <p className="text-sm text-text-secondary">
                Build your reputation with simpler tasks first, then move to higher-paying complex work.
              </p>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-400 mb-3">✅ Do:</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• Deliver high-quality work</li>
                <li>• Meet deadlines</li>
                <li>• Communicate proactively</li>
                <li>• Provide detailed proof</li>
                <li>• Ask questions if unclear</li>
                <li>• Build your reputation</li>
              </ul>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
              <h3 className="font-semibold text-red-400 mb-3">❌ Don't:</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• Submit low-quality work</li>
                <li>• Miss deadlines</li>
                <li>• Ignore client messages</li>
                <li>• Apply to tasks you can't do</li>
                <li>• Copy others' work</li>
                <li>• Spam applications</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Maximizing Earnings */}
        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Maximizing Your Earnings</h2>
          
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-purple-400">1. Use Analytics</h3>
              <p className="text-sm text-text-secondary">
                Check your analytics dashboard to see which task categories pay best and when you earn the most. Focus on your strengths.
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-cyan-400">2. Build Reputation</h3>
              <p className="text-sm text-text-secondary">
                Higher reputation = more opportunities. Complete tasks well, get good ratings, and clients will seek you out.
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-purple-400">3. Work During Peak Hours</h3>
              <p className="text-sm text-text-secondary">
                Analytics shows your peak earning hours. More tasks are posted during certain times - be online then.
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-cyan-400">4. Specialize</h3>
              <p className="text-sm text-text-secondary">
                Become known for excellence in specific categories. Specialists often command higher rates.
              </p>
            </div>
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Common Mistakes to Avoid</h2>
          
          <div className="space-y-3">
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
              <h3 className="font-semibold text-red-400 mb-2">Not Reading Requirements</h3>
              <p className="text-sm text-text-secondary">
                Always read the full task description. Missing requirements leads to rejected work.
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
              <h3 className="font-semibold text-red-400 mb-2">Poor Communication</h3>
              <p className="text-sm text-text-secondary">
                Respond to client messages promptly. Update them on progress. Communication builds trust.
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
              <h3 className="font-semibold text-red-400 mb-2">Rushing Work</h3>
              <p className="text-sm text-text-secondary">
                Quality over speed. One rejected task hurts your reputation more than taking extra time.
              </p>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4">Pro Tips</h2>
          
          <div className="space-y-3 text-text-secondary">
            <p>💡 <strong>Enable notifications</strong> to get alerted when new tasks in your categories are posted</p>
            <p>💡 <strong>Keep proof organized</strong> - screenshots, links, files. Makes submission faster</p>
            <p>💡 <strong>Ask for clarification</strong> before starting if requirements are vague</p>
            <p>💡 <strong>Over-deliver</strong> when possible. Exceeding expectations builds loyal clients</p>
            <p>💡 <strong>Track your time</strong> to understand your effective hourly rate</p>
            <p>💡 <strong>Join the Discord</strong> community to learn from other successful workers</p>
          </div>
        </div>
      </div>    </main>
  )
}
