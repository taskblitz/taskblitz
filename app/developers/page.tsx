'use client'
import { useState } from 'react'
import { Header } from '@/components/Header'
import Link from 'next/link'

export default function DevelopersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const installCode = `npm install @taskblitz/x402-sdk`
  
  const quickStartCode = `import { createTaskBlitzSDK } from '@taskblitz/x402-sdk'

const sdk = createTaskBlitzSDK({
  apiUrl: 'https://taskblitz.click',
  privateKey: process.env.SOLANA_PRIVATE_KEY,
  network: 'devnet',
})

// Create a task
const task = await sdk.createTask({
  title: 'Label 1000 images for AI training',
  description: 'Identify objects in images',
  category: 'data',
  paymentPerTask: 0.10,
  workersNeeded: 1000,
  deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
})

console.log('Task created:', task.task.id)`

  const curlExample = `curl -X POST https://taskblitz.click/api/x402/tasks \\
  -H "Content-Type: application/json" \\
  -H "X-Payment-Signature: YOUR_TX_SIGNATURE" \\
  -H "X-Payment-Amount: 0.10" \\
  -H "X-Payment-Timestamp: $(date +%s)" \\
  -d '{
    "title": "Label images",
    "description": "Identify objects",
    "category": "data",
    "payment_per_task": 0.10,
    "workers_needed": 1000,
    "deadline": "2025-11-19T00:00:00Z",
    "requester_wallet": "YOUR_WALLET_ADDRESS"
  }'`

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <span className="text-purple-400 text-sm font-semibold">🤖 For AI Developers</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            TaskBlitz API
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Hire humans programmatically. Pay in crypto. Scale instantly.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/developers/docs"
              className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold px-8 py-3 rounded-xl hover:scale-105 transition-transform"
            >
              Read Full Docs
            </Link>
            <a
              href="https://github.com/taskblitz/x402-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-xl hover:bg-white/20 transition-all"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Quick Start */}
        <div className="glass-card rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Quick Start</h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-purple-400">1. Install SDK</h3>
              <div className="relative">
                <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <code className="text-green-400">{installCode}</code>
                </pre>
                <button
                  onClick={() => copyCode(installCode, 'install')}
                  className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm"
                >
                  {copiedCode === 'install' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-purple-400">2. Create a Task</h3>
              <div className="relative">
                <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm">{quickStartCode}</code>
                </pre>
                <button
                  onClick={() => copyCode(quickStartCode, 'quickstart')}
                  className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm"
                >
                  {copiedCode === 'quickstart' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-purple-400">3. That&apos;s It!</h3>
              <p className="text-gray-300">
                The SDK automatically handles payment via the x402 protocol. Your task is created and workers can start immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card rounded-xl p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Instant Payments</h3>
            <p className="text-gray-400">Automatic crypto payments via x402 protocol. No manual processing.</p>
          </div>
          <div className="glass-card rounded-xl p-6">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="text-xl font-semibold mb-2">Global Workforce</h3>
            <p className="text-gray-400">Access thousands of workers worldwide. Scale from 1 to 10,000 instantly.</p>
          </div>
          <div className="glass-card rounded-xl p-6">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="text-xl font-semibold mb-2">Secure & Verified</h3>
            <p className="text-gray-400">On-chain payment verification. Escrow protection. Reputation system.</p>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="glass-card rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">API Endpoints</h2>
          <div className="space-y-4">
            <div className="bg-black/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm font-mono">POST</span>
                <code className="text-purple-400">/api/x402/tasks</code>
                <span className="ml-auto text-cyan-400">$0.10</span>
              </div>
              <p className="text-gray-400 text-sm">Create a new task</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm font-mono">GET</span>
                <code className="text-purple-400">/api/x402/tasks</code>
                <span className="ml-auto text-cyan-400">$0.01</span>
              </div>
              <p className="text-gray-400 text-sm">List available tasks</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm font-mono">POST</span>
                <code className="text-purple-400">/api/x402/submissions</code>
                <span className="ml-auto text-cyan-400">$0.05</span>
              </div>
              <p className="text-gray-400 text-sm">Submit work for a task</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm font-mono">GET</span>
                <code className="text-purple-400">/api/x402/submissions</code>
                <span className="ml-auto text-cyan-400">$0.01</span>
              </div>
              <p className="text-gray-400 text-sm">Query submissions</p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="glass-card rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">🤖 AI Training Data</h3>
              <p className="text-gray-300 mb-3">Label images, annotate text, verify outputs for ML models.</p>
              <code className="text-sm text-cyan-400">10,000 images labeled in 24 hours</code>
            </div>
            <div className="bg-black/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">🎨 Content Generation</h3>
              <p className="text-gray-300 mb-3">Create memes, write posts, generate marketing content at scale.</p>
              <code className="text-sm text-cyan-400">100 memes created in 2 hours</code>
            </div>
            <div className="bg-black/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">🧪 Testing & QA</h3>
              <p className="text-gray-300 mb-3">Test apps, verify functionality, find bugs with real users.</p>
              <code className="text-sm text-cyan-400">1,000 testers on demand</code>
            </div>
            <div className="bg-black/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">🌐 IoT Verification</h3>
              <p className="text-gray-300 mb-3">Smart devices paying humans to verify sensor readings.</p>
              <code className="text-sm text-cyan-400">Machine-to-human payments</code>
            </div>
          </div>
        </div>

        {/* cURL Example */}
        <div className="glass-card rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Raw API Example (cURL)</h2>
          <div className="relative">
            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm">{curlExample}</code>
            </pre>
            <button
              onClick={() => copyCode(curlExample, 'curl')}
              className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm"
            >
              {copiedCode === 'curl' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Resources */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6">Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/developers/docs" className="bg-black/30 hover:bg-black/50 rounded-lg p-4 transition-colors">
              <h3 className="font-semibold mb-2 text-purple-400">📚 Complete Documentation</h3>
              <p className="text-gray-400 text-sm">Full integration guide with examples</p>
            </Link>
            <Link href="/developers/quickstart" className="bg-black/30 hover:bg-black/50 rounded-lg p-4 transition-colors">
              <h3 className="font-semibold mb-2 text-cyan-400">⚡ Quick Start Guide</h3>
              <p className="text-gray-400 text-sm">Get started in 5 minutes</p>
            </Link>
            <a href="https://github.com/taskblitz/x402-sdk" target="_blank" rel="noopener noreferrer" className="bg-black/30 hover:bg-black/50 rounded-lg p-4 transition-colors">
              <h3 className="font-semibold mb-2 text-green-400">💻 GitHub Repository</h3>
              <p className="text-gray-400 text-sm">View source code and examples</p>
            </a>
            <a href="https://x402.org" target="_blank" rel="noopener noreferrer" className="bg-black/30 hover:bg-black/50 rounded-lg p-4 transition-colors">
              <h3 className="font-semibold mb-2 text-blue-400">🔗 x402 Protocol</h3>
              <p className="text-gray-400 text-sm">Learn about the payment protocol</p>
            </a>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-12 p-8 glass-card rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-gray-300 mb-6">Join our developer community or reach out directly</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://discord.gg/taskblitz" target="_blank" rel="noopener noreferrer" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors">
              Discord Community
            </a>
            <a href="mailto:dev@taskblitz.click" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors">
              Email Support
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
