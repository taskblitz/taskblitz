'use client'
import { Header } from '@/components/Header'
import Link from 'next/link'
import { useState } from 'react'

function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm">{code}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-sm transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? '✓ Copied!' : '📋 Copy'}
      </button>
    </div>
  )
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📖' },
    { id: 'quickstart', title: 'Quick Start', icon: '⚡' },
    { id: 'authentication', title: 'Authentication', icon: '🔐' },
    { id: 'endpoints', title: 'API Endpoints', icon: '🔌' },
    { id: 'sdk', title: 'SDK Reference', icon: '📦' },
    { id: 'examples', title: 'Examples', icon: '💡' },
    { id: 'pricing', title: 'Pricing', icon: '💰' },
  ]

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 glass-card rounded-xl p-4">
              <h3 className="font-semibold mb-4 text-purple-400">Documentation</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-purple-600 text-white'
                        : 'hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                <Link href="/developers" className="text-sm text-cyan-400 hover:text-cyan-300">
                  ← Back to Developers
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 glass-card rounded-2xl p-8">
            <div className="prose prose-invert max-w-none">
              <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                TaskBlitz API Documentation
              </h1>

              {/* Overview */}
              <section id="overview" className="mb-12">
                <h2 className="text-3xl font-bold mb-4">Overview</h2>
                <p className="text-gray-300 text-lg mb-4">
                  TaskBlitz API enables AI agents and automated systems to hire humans programmatically. 
                  Built on the x402 protocol by Coinbase, it provides instant crypto payments and global workforce access.
                </p>
                
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6 my-6">
                  <h3 className="text-xl font-semibold mb-3 text-purple-400">Key Features</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>✅ Automatic payment handling via x402 protocol</li>
                    <li>✅ Instant crypto payments (2-second settlement)</li>
                    <li>✅ Global workforce (thousands of workers)</li>
                    <li>✅ Scale from 1 to 10,000 workers instantly</li>
                    <li>✅ No registration or OAuth required</li>
                    <li>✅ Simple SDK (3 lines of code)</li>
                  </ul>
                </div>
              </section>

              {/* Quick Start */}
              <section id="quickstart" className="mb-12">
                <h2 className="text-3xl font-bold mb-4">Quick Start</h2>
                
                <h3 className="text-2xl font-semibold mb-3 text-purple-400">1. Install SDK</h3>
                <div className="mb-6">
                  <CodeBlock code="npm install @taskblitz/x402-sdk" language="bash" />
                </div>

                <h3 className="text-2xl font-semibold mb-3 text-purple-400">2. Initialize Client</h3>
                <div className="mb-6">
                  <CodeBlock code={`import { createTaskBlitzSDK } from '@taskblitz/x402-sdk'

const sdk = createTaskBlitzSDK({
  apiUrl: 'https://taskblitz.click',
  privateKey: process.env.SOLANA_PRIVATE_KEY,
  network: 'devnet', // or 'mainnet-beta'
})`} />
                </div>

                <h3 className="text-2xl font-semibold mb-3 text-purple-400">3. Create Your First Task</h3>
                <div className="mb-6">
                  <CodeBlock code={`const task = await sdk.createTask({
  title: 'Label 1000 images',
  description: 'Identify objects in images',
  category: 'data',
  paymentPerTask: 0.10,
  workersNeeded: 1000,
  deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
})

console.log('Task created:', task.task.id)
// Payment handled automatically!`} />
                </div>
              </section>

              {/* Authentication */}
              <section id="authentication" className="mb-12">
                <h2 className="text-3xl font-bold mb-4">Authentication</h2>
                <p className="text-gray-300 mb-4">
                  TaskBlitz uses the x402 protocol for authentication. When you make an API request without payment, 
                  you&apos;ll receive a 402 status code with payment details. The SDK handles this automatically.
                </p>

                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-6 my-6">
                  <h3 className="text-xl font-semibold mb-3 text-cyan-400">How It Works</h3>
                  <ol className="space-y-3 text-gray-300">
                    <li>1. Your app makes an API request</li>
                    <li>2. API returns 402 with payment details</li>
                    <li>3. SDK automatically sends payment transaction</li>
                    <li>4. SDK retries request with payment proof</li>
                    <li>5. API verifies payment on-chain</li>
                    <li>6. Request succeeds!</li>
                  </ol>
                </div>
              </section>

              {/* API Endpoints */}
              <section id="endpoints" className="mb-12">
                <h2 className="text-3xl font-bold mb-4">API Endpoints</h2>
                
                <div className="space-y-6">
                  <div className="bg-black/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded font-mono text-sm">POST</span>
                      <code className="text-purple-400 text-lg">/api/x402/tasks</code>
                      <span className="ml-auto text-cyan-400 font-semibold">$0.10</span>
                    </div>
                    <p className="text-gray-300 mb-4">Create a new task</p>
                    <details className="text-sm">
                      <summary className="cursor-pointer text-purple-400 hover:text-purple-300 mb-2">View Request Body</summary>
                      <pre className="bg-black/50 rounded p-3 mt-2 overflow-x-auto">
                        <code>{`{
  "title": "Task title",
  "description": "Task description",
  "category": "data",
  "payment_per_task": 0.10,
  "workers_needed": 1000,
  "deadline": "2025-11-19T00:00:00Z",
  "requester_wallet": "YOUR_WALLET_ADDRESS"
}`}</code>
                      </pre>
                    </details>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded font-mono text-sm">GET</span>
                      <code className="text-purple-400 text-lg">/api/x402/tasks</code>
                      <span className="ml-auto text-cyan-400 font-semibold">$0.01</span>
                    </div>
                    <p className="text-gray-300">List available tasks</p>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded font-mono text-sm">POST</span>
                      <code className="text-purple-400 text-lg">/api/x402/submissions</code>
                      <span className="ml-auto text-cyan-400 font-semibold">$0.05</span>
                    </div>
                    <p className="text-gray-300">Submit work for a task</p>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded font-mono text-sm">GET</span>
                      <code className="text-purple-400 text-lg">/api/x402/submissions</code>
                      <span className="ml-auto text-cyan-400 font-semibold">$0.01</span>
                    </div>
                    <p className="text-gray-300">Query submissions by task or worker</p>
                  </div>
                </div>
              </section>

              {/* SDK Reference */}
              <section id="sdk" className="mb-12">
                <h2 className="text-3xl font-bold mb-4">SDK Reference</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-3 text-purple-400">createTask()</h3>
                    <p className="text-gray-300 mb-3">Create a new task with automatic payment handling.</p>
                    <CodeBlock code={`await sdk.createTask({
  title: string,
  description: string,
  category: 'data' | 'content' | 'testing' | 'crypto_marketing' | 'ecommerce' | 'other',
  paymentPerTask: number,
  workersNeeded: number,
  deadline: Date,
})`} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold mb-3 text-purple-400">listTasks()</h3>
                    <p className="text-gray-300 mb-3">Get list of available tasks.</p>
                    <CodeBlock code="const tasks = await sdk.listTasks()" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold mb-3 text-purple-400">submitWork()</h3>
                    <p className="text-gray-300 mb-3">Submit work for a task.</p>
                    <CodeBlock code={`await sdk.submitWork({
  taskId: string,
  submissionType: 'text' | 'url' | 'file',
  submissionText?: string,
  submissionUrl?: string,
})`} />
                  </div>
                </div>
              </section>

              {/* Examples */}
              <section id="examples" className="mb-12">
                <h2 className="text-3xl font-bold mb-4">Examples</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-semibold mb-3 text-purple-400">AI Agent Hiring Humans</h3>
                    <p className="text-gray-300 mb-4">
                      An AI agent needs to verify information from websites that require human judgment.
                    </p>
                    <CodeBlock code={`import { createTaskBlitzSDK } from '@taskblitz/x402-sdk'

const sdk = createTaskBlitzSDK({
  apiUrl: 'https://taskblitz.click',
  privateKey: process.env.SOLANA_PRIVATE_KEY,
  network: 'mainnet-beta',
})

// AI agent creates task
const task = await sdk.createTask({
  title: 'Verify restaurant is still open',
  description: 'Visit website and confirm business hours',
  category: 'data',
  paymentPerTask: 0.50,
  workersNeeded: 3, // Get 3 confirmations
  deadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
})

console.log('Task created:', task.task.id)
// Humans will complete it within 2 hours!`} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold mb-3 text-purple-400">Batch Data Labeling</h3>
                    <p className="text-gray-300 mb-4">
                      Scale to thousands of workers instantly for large datasets.
                    </p>
                    <CodeBlock code={`// Label 10,000 images with human verification
const task = await sdk.createTask({
  title: 'Label images: cat or dog',
  description: 'View image and select correct label',
  category: 'data',
  paymentPerTask: 0.05,
  workersNeeded: 10000,
  deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
})

// Check progress
const submissions = await sdk.getSubmissions(task.task.id)
console.log(\`Progress: \${submissions.length}/10000\`)`} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold mb-3 text-purple-400">Content Moderation</h3>
                    <p className="text-gray-300 mb-4">
                      Use humans for nuanced content decisions AI struggles with.
                    </p>
                    <CodeBlock code={`// Review flagged content
const task = await sdk.createTask({
  title: 'Review user-generated content',
  description: 'Determine if content violates guidelines',
  category: 'content',
  paymentPerTask: 0.25,
  workersNeeded: 100,
  deadline: new Date(Date.now() + 6 * 60 * 60 * 1000),
})`} />
                  </div>
                </div>
              </section>

              {/* Pricing */}
              <section id="pricing" className="mb-12">
                <h2 className="text-3xl font-bold mb-4">Pricing</h2>
                
                <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-lg p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 text-purple-400">Endpoint</th>
                        <th className="text-left py-3 text-purple-400">Cost</th>
                        <th className="text-left py-3 text-purple-400">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      <tr className="border-b border-white/5">
                        <td className="py-3">POST /api/x402/tasks</td>
                        <td className="py-3 text-cyan-400 font-semibold">$0.10</td>
                        <td className="py-3">Create task</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3">GET /api/x402/tasks</td>
                        <td className="py-3 text-cyan-400 font-semibold">$0.01</td>
                        <td className="py-3">List tasks</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3">POST /api/x402/submissions</td>
                        <td className="py-3 text-cyan-400 font-semibold">$0.05</td>
                        <td className="py-3">Submit work</td>
                      </tr>
                      <tr>
                        <td className="py-3">GET /api/x402/submissions</td>
                        <td className="py-3 text-cyan-400 font-semibold">$0.01</td>
                        <td className="py-3">Query submissions</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <p className="text-sm text-gray-400 mt-4">
                    * API fees are separate from task payments. Task payments go directly to workers.
                  </p>
                </div>
              </section>

              {/* Support */}
              <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
                <p className="text-gray-300 mb-6">Join our developer community or reach out directly</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="https://discord.gg/taskblitz" target="_blank" rel="noopener noreferrer" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors">
                    Discord
                  </a>
                  <a href="mailto:dev@taskblitz.click" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors">
                    Email
                  </a>
                  <a href="https://github.com/taskblitz/x402-sdk" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
