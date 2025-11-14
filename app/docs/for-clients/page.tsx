'use client'
import { Header } from '@/components/Header'
import Link from 'next/link'

export default function ForClientsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/docs" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">
          ← Back to Documentation
        </Link>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Guide for Clients
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          How to post effective tasks and get quality work completed
        </p>

        {/* Getting Started */}
        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-3 text-text-secondary">
            <li>Connect your Solana wallet and add USDC</li>
            <li>Click "Post Task" in the header</li>
            <li>Fill in task details clearly and completely</li>
            <li>Set a fair reward for the work required</li>
            <li>Review applications and accept a worker</li>
            <li>Review submitted work and approve if satisfactory</li>
          </ol>
        </div>

        {/* Writing Good Task Descriptions */}
        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Writing Effective Task Descriptions</h2>
          
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-purple-400">Be Specific</h3>
              <p className="text-sm text-text-secondary mb-2">
                Clearly state what you need. Vague descriptions lead to poor results.
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div className="bg-red-500/10 border border-red-500/20 p-2 rounded">
                  <strong className="text-red-400">❌ Bad:</strong> "Write an article"
                </div>
                <div className="bg-green-500/10 border border-green-500/20 p-2 rounded">
                  <strong className="text-green-400">✅ Good:</strong> "Write a 500-word article about Solana DeFi for beginners"
                </div>
              </div>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-cyan-400">Include Requirements</h3>
              <p className="text-sm text-text-secondary">
                List all requirements upfront: word count, format, style, deadline, etc.
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-purple-400">Define Deliverables</h3>
              <p className="text-sm text-text-secondary">
                Specify exactly what you expect to receive: Google Doc link, PDF file, screenshot, etc.
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-cyan-400">Set Realistic Deadlines</h3>
              <p className="text-sm text-text-secondary">
                Give workers enough time to do quality work. Rush jobs often result in poor quality.
              </p>
            </div>
          </div>
        </div>

        {/* Setting Fair Rewards */}
        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Setting Fair Rewards</h2>
          
          <div className="space-y-4">
            <p className="text-text-secondary">
              Fair compensation attracts quality workers. Consider these factors:
            </p>

            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-purple-400">Task Complexity</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Easy tasks (data entry, simple research): $5-15</li>
                <li>• Medium tasks (writing, design, testing): $15-50</li>
                <li>• Hard tasks (development, complex analysis): $50-200+</li>
              </ul>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-cyan-400">Time Required</h3>
              <p className="text-sm text-text-secondary">
                Estimate how long the task will take. A fair rate is $15-30/hour for most tasks.
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-purple-400">Browse Similar Tasks</h3>
              <p className="text-sm text-text-secondary">
                Check what others are paying for similar work. Competitive rewards get faster results.
              </p>
            </div>
          </div>
        </div>

        {/* Selecting Workers */}
        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Selecting the Right Worker</h2>
          
          <div className="space-y-3">
            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-purple-400">Check Reputation</h3>
              <p className="text-sm text-text-secondary">
                Look at completed tasks, ratings, and reviews. Higher reputation = more reliable.
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-cyan-400">Review Past Work</h3>
              <p className="text-sm text-text-secondary">
                If available, check their portfolio or previous task completions in similar categories.
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-purple-400">Communication</h3>
              <p className="text-sm text-text-secondary">
                Workers who ask clarifying questions show they care about doing it right.
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Advanced Features for Clients</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-purple-400">Task Templates</h3>
              <p className="text-sm text-text-secondary mb-2">
                Post the same type of task regularly? Save it as a template for one-click posting.
              </p>
              <Link href="/templates" className="text-purple-400 hover:text-purple-300 text-sm">
                Manage Templates →
              </Link>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-cyan-400">Bulk Task Creation</h3>
              <p className="text-sm text-text-secondary mb-2">
                Need to post hundreds of tasks? Upload a CSV file to create them all at once.
              </p>
              <Link href="/bulk-tasks" className="text-cyan-400 hover:text-cyan-300 text-sm">
                Bulk Upload →
              </Link>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-purple-400">Analytics</h3>
              <p className="text-sm text-text-secondary mb-2">
                Track spending, completion rates, and find the best times to post tasks.
              </p>
              <Link href="/analytics" className="text-purple-400 hover:text-purple-300 text-sm">
                View Analytics →
              </Link>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-cyan-400">Webhooks</h3>
              <p className="text-sm text-text-secondary mb-2">
                Get notified in Slack or your own system when tasks are completed.
              </p>
              <Link href="/settings/webhooks" className="text-cyan-400 hover:text-cyan-300 text-sm">
                Setup Webhooks →
              </Link>
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
                <li>• Write clear descriptions</li>
                <li>• Set fair rewards</li>
                <li>• Respond to questions quickly</li>
                <li>• Approve good work promptly</li>
                <li>• Leave honest ratings</li>
                <li>• Build relationships with good workers</li>
              </ul>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
              <h3 className="font-semibold text-red-400 mb-3">❌ Don't:</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• Be vague about requirements</li>
                <li>• Underpay for work</li>
                <li>• Ignore worker messages</li>
                <li>• Reject good work unfairly</li>
                <li>• Change requirements mid-task</li>
                <li>• Delay approvals unnecessarily</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4">Pro Tips</h2>
          
          <div className="space-y-3 text-text-secondary">
            <p>💡 <strong>Post during peak hours</strong> - Check analytics to see when most workers are active</p>
            <p>💡 <strong>Build a team</strong> - Find reliable workers and work with them repeatedly</p>
            <p>💡 <strong>Provide examples</strong> - Show what good work looks like</p>
            <p>💡 <strong>Be responsive</strong> - Quick communication leads to faster completion</p>
            <p>💡 <strong>Use templates</strong> - Save time on recurring tasks</p>
            <p>💡 <strong>Start small</strong> - Test workers with smaller tasks before big projects</p>
          </div>
        </div>
      </div>    </main>
  )
}
