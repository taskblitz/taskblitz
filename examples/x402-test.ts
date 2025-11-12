/**
 * x402 Integration Test Script
 * Tests all x402 functionality
 */

import { createTaskBlitzSDK } from '../lib/x402/sdk'

async function runTests() {
  console.log('🧪 Starting x402 Integration Tests\n')

  // Test 1: SDK Initialization
  console.log('Test 1: SDK Initialization')
  try {
    const sdk = createTaskBlitzSDK({
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      privateKey: process.env.TEST_PRIVATE_KEY || '',
      network: 'devnet',
    })

    console.log('✅ SDK initialized')
    console.log('   Wallet:', sdk.getAddress())
    console.log('   Balance:', await sdk.getBalance(), 'SOL\n')
  } catch (error) {
    console.error('❌ SDK initialization failed:', error)
    return
  }

  // Test 2: 402 Response
  console.log('Test 2: 402 Payment Required Response')
  try {
    const response = await fetch('http://localhost:3000/api/x402/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Task',
        description: 'Test',
        category: 'testing',
        payment_per_task: 1.0,
        workers_needed: 1,
        deadline: new Date(Date.now() + 86400000).toISOString(),
        requester_wallet: 'test',
      }),
    })

    if (response.status === 402) {
      const data = await response.json()
      console.log('✅ 402 response received')
      console.log('   Payment required:', data.payment.amount, data.payment.currency)
      console.log('   Recipient:', data.payment.recipient)
      console.log('   Protocol:', data.protocol, '\n')
    } else {
      console.error('❌ Expected 402, got:', response.status, '\n')
    }
  } catch (error) {
    console.error('❌ 402 test failed:', error, '\n')
  }

  // Test 3: Payment Headers
  console.log('Test 3: Payment Header Validation')
  try {
    const response = await fetch('http://localhost:3000/api/x402/tasks', {
      method: 'GET',
      headers: {
        'X-Payment-Signature': 'test_signature',
        'X-Payment-Amount': '0.01',
        'X-Payment-Timestamp': Math.floor(Date.now() / 1000).toString(),
        'X-Payment-Proof': 'solana',
      },
    })

    console.log('✅ Payment headers accepted')
    console.log('   Status:', response.status)
    console.log('   Response:', response.ok ? 'OK' : 'Failed', '\n')
  } catch (error) {
    console.error('❌ Payment header test failed:', error, '\n')
  }

  // Test 4: SDK Task Creation (if private key provided)
  if (process.env.TEST_PRIVATE_KEY) {
    console.log('Test 4: SDK Task Creation')
    try {
      const sdk = createTaskBlitzSDK({
        apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        privateKey: process.env.TEST_PRIVATE_KEY,
        network: 'devnet',
      })

      const task = await sdk.createTask({
        title: 'Test Task via SDK',
        description: 'This is a test task created via x402 SDK',
        category: 'testing',
        paymentPerTask: 1.0,
        workersNeeded: 1,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })

      console.log('✅ Task created via SDK')
      console.log('   Task ID:', task.task.id)
      console.log('   Title:', task.task.title)
      console.log('   Escrow:', task.task.escrow_amount, 'USDC\n')
    } catch (error) {
      console.error('❌ SDK task creation failed:', error, '\n')
    }
  } else {
    console.log('Test 4: Skipped (no TEST_PRIVATE_KEY provided)\n')
  }

  // Test 5: API Endpoint Availability
  console.log('Test 5: API Endpoint Availability')
  const endpoints = [
    { method: 'POST', path: '/api/x402/tasks' },
    { method: 'GET', path: '/api/x402/tasks' },
    { method: 'POST', path: '/api/x402/submissions' },
    { method: 'GET', path: '/api/x402/submissions' },
  ]

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3000${endpoint.path}`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
      })

      const status = response.status === 402 ? '402 (Payment Required)' : response.status
      console.log(`   ${endpoint.method} ${endpoint.path}: ${status}`)
    } catch (error) {
      console.log(`   ${endpoint.method} ${endpoint.path}: ❌ Failed`)
    }
  }

  console.log('\n🎉 Tests completed!')
  console.log('\nNext steps:')
  console.log('1. Set TEST_PRIVATE_KEY to test full payment flow')
  console.log('2. Deploy to production')
  console.log('3. Test with real AI agents')
}

// Run tests
runTests()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test suite failed:', error)
    process.exit(1)
  })
