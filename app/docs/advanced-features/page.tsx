'use client'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { FileText, Upload, Zap, Key, BarChart3, Webhook } from 'lucide-react'

export default function AdvancedFeaturesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/docs" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">
          ← Back to Documentation
        </Link>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Advanced Features
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          Power features for advanced users and developers
        </p>

        {/* Task Templates */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Task Templates</h2>
              <p className="text-text-secondary mb-4">
                Save time by creating reusable task templates. Perfect for clients who post similar tasks regularly.
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-purple-400">How to Use:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary">
                  <li>Go to the Templates page</li>
                  <li>Click "Create Template" and fill in your task details</li>
                  <li>Save the template for future use</li>
                  <li>When posting a new task, select your template to auto-fill the form</li>
                </ol>
              </div>

              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-cyan-400">Pro Tips:</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• Make templates public to share with the community</li>
                  <li>• Track how many times each template is used</li>
                  <li>• Browse popular community templates for inspiration</li>
                </ul>
              </div>

              <Link href="/templates" className="btn-primary inline-block">
                Manage Templates
              </Link>
            </div>
          </div>
        </div>

        {/* Bulk Task Creation */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Upload className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Bulk Task Creation</h2>
              <p className="text-text-secondary mb-4">
                Create hundreds of tasks at once by uploading a CSV file. Ideal for large projects with many similar tasks.
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-cyan-400">CSV Format:</h3>
                <pre className="text-xs bg-black/50 p-3 rounded overflow-x-auto text-text-secondary">
{`title,description,category,difficulty,reward
"Write blog post","500 words","Content Writing","medium",25
"Data entry","100 records","Data Entry","easy",15`}
                </pre>
              </div>

              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-purple-400">Features:</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• Download CSV template with correct format</li>
                  <li>• Real-time processing status</li>
                  <li>• Error logging for failed tasks</li>
                  <li>• Upload history tracking</li>
                </ul>
              </div>

              <Link href="/bulk-tasks" className="btn-primary inline-block">
                Upload Bulk Tasks
              </Link>
            </div>
          </div>
        </div>

        {/* Advanced Analytics */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Advanced Analytics</h2>
              <p className="text-text-secondary mb-4">
                Get deep insights into your TaskBlitz performance with comprehensive analytics and visualizations.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-black/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-purple-400">For Workers:</h3>
                  <ul className="space-y-1 text-sm text-text-secondary">
                    <li>• Earnings trends over time</li>
                    <li>• Peak earning hours</li>
                    <li>• Task performance by category</li>
                    <li>• Skill analysis and success rates</li>
                    <li>• Potential earnings calculator</li>
                  </ul>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-cyan-400">For Clients:</h3>
                  <ul className="space-y-1 text-sm text-text-secondary">
                    <li>• Spending trends</li>
                    <li>• Task completion rates</li>
                    <li>• Best posting times</li>
                    <li>• Average task costs</li>
                    <li>• Category performance</li>
                  </ul>
                </div>
              </div>

              <Link href="/analytics" className="btn-primary inline-block">
                View Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* Webhooks */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Webhook className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Webhooks & Integrations</h2>
              <p className="text-text-secondary mb-4">
                Receive real-time notifications when events occur. Integrate TaskBlitz with Slack, Discord, or your own systems.
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-cyan-400">Available Events:</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• <code className="bg-black/50 px-2 py-1 rounded">task.created</code> - When a new task is posted</li>
                  <li>• <code className="bg-black/50 px-2 py-1 rounded">task.completed</code> - When a task is completed</li>
                  <li>• <code className="bg-black/50 px-2 py-1 rounded">task.cancelled</code> - When a task is cancelled</li>
                  <li>• <code className="bg-black/50 px-2 py-1 rounded">payment.received</code> - When you receive payment</li>
                  <li>• <code className="bg-black/50 px-2 py-1 rounded">payment.sent</code> - When you send payment</li>
                </ul>
              </div>

              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-purple-400">Security:</h3>
                <p className="text-sm text-text-secondary mb-2">
                  All webhook requests include an HMAC signature in the <code className="bg-black/50 px-2 py-1 rounded">X-TaskBlitz-Signature</code> header 
                  for verification. Use your webhook's secret key to verify the signature.
                </p>
              </div>

              <Link href="/settings/webhooks" className="btn-primary inline-block">
                Manage Webhooks
              </Link>
            </div>
          </div>
        </div>

        {/* API Access */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Key className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">API Access & Rate Limiting</h2>
              <p className="text-text-secondary mb-4">
                Generate API keys to integrate TaskBlitz into your applications. Rate limiting protects the platform from abuse.
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-purple-400">Rate Limits:</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• 60 requests per minute</li>
                  <li>• 1,000 requests per hour</li>
                  <li>• 10,000 requests per day</li>
                </ul>
              </div>

              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-cyan-400">Usage Tracking:</h3>
                <p className="text-sm text-text-secondary">
                  Monitor your API usage with detailed analytics including request counts, success rates, and average response times.
                </p>
              </div>

              <div className="flex gap-3">
                <Link href="/settings/api" className="btn-primary inline-block">
                  Manage API Keys
                </Link>
                <Link href="/developers/docs" className="btn-secondary inline-block">
                  API Documentation
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6">Real-World Use Cases</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 text-purple-400">Content Agency</h3>
              <p className="text-text-secondary text-sm">
                Uses task templates for recurring blog posts, bulk creation for large content projects, and webhooks to notify their project management tool when tasks are completed.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-cyan-400">E-commerce Store</h3>
              <p className="text-text-secondary text-sm">
                Uploads CSV files with 500 product descriptions needed, uses analytics to find the best posting times, and integrates with their inventory system via API.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-purple-400">Freelance Worker</h3>
              <p className="text-text-secondary text-sm">
                Uses analytics to identify their most profitable task categories, sets up Slack notifications for new tasks in their specialty, and tracks peak earning hours.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-cyan-400">SaaS Platform</h3>
              <p className="text-text-secondary text-sm">
                Integrates TaskBlitz payments into their app using the API, uses webhooks to update user accounts when payments complete, and monitors usage with rate limit analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
