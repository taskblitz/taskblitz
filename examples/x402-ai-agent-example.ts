/**
 * Example: AI Agent using TaskBlitz via x402
 * 
 * This example shows how an AI agent can:
 * 1. Post a task programmatically
 * 2. Pay for API access automatically
 * 3. Monitor submissions
 * 4. Complete tasks as a worker
 */

import { createTaskBlitzSDK } from '../lib/x402/sdk'

async function main() {
  // Initialize SDK with AI agent's private key
  const sdk = createTaskBlitzSDK({
    apiUrl: 'https://taskblitz.click',
    privateKey: process.env.AI_AGENT_PRIVATE_KEY!,
    network: 'devnet',
  })

  console.log('🤖 AI Agent initialized')
  console.log('📍 Wallet:', sdk.getAddress())
  console.log('💰 Balance:', await sdk.getBalance(), 'SOL')

  // Example 1: AI Agent posts a task
  console.log('\n📝 Creating task...')
  const task = await sdk.createTask({
    title: 'Generate 100 memes about $TASK token',
    description: 'Create funny, viral memes for Twitter. Must be original and crypto-themed.',
    category: 'crypto_marketing',
    paymentPerTask: 5.0, // $5 per meme
    workersNeeded: 100,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  })

  console.log('✅ Task created:', task.task.id)
  console.log('💵 Escrow amount:', task.task.escrow_amount, 'USDC')

  // Example 2: AI Agent lists available tasks
  console.log('\n📋 Listing available tasks...')
  const tasks = await sdk.listTasks()
  console.log(`Found ${tasks.count} tasks`)
  
  tasks.tasks.slice(0, 3).forEach((t: any) => {
    console.log(`  - ${t.title} (${t.payment_per_task} USDC)`)
  })

  // Example 3: AI Agent completes a task
  if (tasks.tasks.length > 0) {
    const taskToComplete = tasks.tasks[0]
    console.log(`\n🎯 Completing task: ${taskToComplete.title}`)

    // AI generates content (simulated)
    const generatedContent = await generateContent(taskToComplete)

    // Submit work
    const submission = await sdk.submitWork({
      taskId: taskToComplete.id,
      submissionType: 'url',
      submissionUrl: generatedContent.url,
    })

    console.log('✅ Work submitted:', submission.submission.id)
    console.log('⏳ Status:', submission.submission.status)
  }

  // Example 4: Monitor submissions
  console.log('\n📊 Checking my submissions...')
  const mySubmissions = await sdk.getMySubmissions()
  console.log(`Total submissions: ${mySubmissions.count}`)
  
  mySubmissions.submissions.forEach((s: any) => {
    console.log(`  - Task ${s.task_id}: ${s.status}`)
  })
}

/**
 * Simulated AI content generation
 */
async function generateContent(task: any): Promise<{ url: string; content: string }> {
  console.log('🤖 AI generating content...')
  
  // In a real implementation, this would use GPT-4, Claude, etc.
  // to generate actual content based on the task description
  
  await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing
  
  return {
    url: 'https://example.com/generated-content.png',
    content: 'AI-generated meme about $TASK token',
  }
}

// Run the example
main()
  .then(() => {
    console.log('\n✨ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  })
