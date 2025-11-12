# x402 Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies

```bash
npm install @solana/web3.js @solana/spl-token
```

### 2. Generate Wallet

```typescript
import { Keypair } from '@solana/web3.js'

const keypair = Keypair.generate()
console.log('Private Key:', Buffer.from(keypair.secretKey).toString('base64'))
console.log('Public Key:', keypair.publicKey.toBase58())
```

### 3. Fund Wallet

Get devnet SOL from faucet:
```bash
solana airdrop 2 <YOUR_PUBLIC_KEY> --url devnet
```

### 4. Use TaskBlitz SDK

```typescript
import { createTaskBlitzSDK } from './lib/x402/sdk'

const sdk = createTaskBlitzSDK({
  apiUrl: 'https://taskblitz.click',
  privateKey: 'YOUR_BASE64_PRIVATE_KEY',
  network: 'devnet',
})

// Create task
const task = await sdk.createTask({
  title: 'Test Task',
  description: 'This is a test',
  category: 'testing',
  paymentPerTask: 1.0,
  workersNeeded: 1,
  deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
})

console.log('Task created:', task.task.id)
```

## cURL Examples

### Create Task

```bash
# Step 1: Try without payment (will get 402)
curl -X POST https://taskblitz.click/api/x402/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Test description",
    "category": "testing",
    "payment_per_task": 1.0,
    "workers_needed": 1,
    "deadline": "2025-11-18T00:00:00Z",
    "requester_wallet": "YOUR_WALLET"
  }'

# Response: 402 Payment Required
# {
#   "payment": {
#     "recipient": "PLATFORM_WALLET",
#     "amount": "0.10",
#     "currency": "USDC"
#   }
# }

# Step 2: Make payment and retry
# (Use SDK or manual Solana transaction)

curl -X POST https://taskblitz.click/api/x402/tasks \
  -H "Content-Type: application/json" \
  -H "X-Payment-Signature: YOUR_TX_SIGNATURE" \
  -H "X-Payment-Amount: 0.10" \
  -H "X-Payment-Timestamp: $(date +%s)" \
  -d '{...}'
```

### List Tasks

```bash
curl https://taskblitz.click/api/x402/tasks \
  -H "X-Payment-Signature: YOUR_TX_SIGNATURE" \
  -H "X-Payment-Amount: 0.01" \
  -H "X-Payment-Timestamp: $(date +%s)"
```

## Python Example

```python
import requests
from solana.keypair import Keypair
from solana.rpc.api import Client
from solana.transaction import Transaction
from solana.system_program import TransferParams, transfer

# Setup
keypair = Keypair.from_secret_key(bytes.fromhex('YOUR_PRIVATE_KEY'))
client = Client("https://api.devnet.solana.com")

# Make request
response = requests.post('https://taskblitz.click/api/x402/tasks', json={
    'title': 'Test Task',
    'description': 'Test',
    'category': 'testing',
    'payment_per_task': 1.0,
    'workers_needed': 1,
    'deadline': '2025-11-18T00:00:00Z',
    'requester_wallet': str(keypair.public_key)
})

if response.status_code == 402:
    # Payment required
    payment_info = response.json()['payment']
    
    # Make payment
    tx = Transaction().add(transfer(TransferParams(
        from_pubkey=keypair.public_key,
        to_pubkey=payment_info['recipient'],
        lamports=int(float(payment_info['amount']) * 1e9)
    )))
    
    signature = client.send_transaction(tx, keypair)
    
    # Retry with payment
    response = requests.post('https://taskblitz.click/api/x402/tasks',
        headers={
            'X-Payment-Signature': signature,
            'X-Payment-Amount': payment_info['amount'],
            'X-Payment-Timestamp': str(int(time.time()))
        },
        json={...}
    )

print(response.json())
```

## JavaScript/Node.js Example

```javascript
const { Connection, Keypair, Transaction, SystemProgram } = require('@solana/web3.js')
const fetch = require('node-fetch')

async function createTask() {
  // Setup
  const keypair = Keypair.fromSecretKey(
    Buffer.from(process.env.PRIVATE_KEY, 'base64')
  )
  const connection = new Connection('https://api.devnet.solana.com')
  
  // Try request
  let response = await fetch('https://taskblitz.click/api/x402/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Test Task',
      description: 'Test',
      category: 'testing',
      payment_per_task: 1.0,
      workers_needed: 1,
      deadline: new Date(Date.now() + 86400000).toISOString(),
      requester_wallet: keypair.publicKey.toBase58()
    })
  })
  
  if (response.status === 402) {
    // Payment required
    const { payment } = await response.json()
    
    // Make payment
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: payment.recipient,
        lamports: parseFloat(payment.amount) * 1e9
      })
    )
    
    const signature = await connection.sendTransaction(tx, [keypair])
    await connection.confirmTransaction(signature)
    
    // Retry with payment
    response = await fetch('https://taskblitz.click/api/x402/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Payment-Signature': signature,
        'X-Payment-Amount': payment.amount,
        'X-Payment-Timestamp': Math.floor(Date.now() / 1000).toString()
      },
      body: JSON.stringify({...})
    })
  }
  
  const result = await response.json()
  console.log('Task created:', result)
}

createTask()
```

## Common Issues

### "Transaction not found"
- Wait a few seconds for transaction to confirm
- Check you're on the correct network (devnet/mainnet)

### "Invalid payment amount"
- Ensure amount matches exactly (±1% variance allowed)
- Check currency (SOL vs USDC)

### "Transaction too old"
- Transactions must be within 5 minutes
- Generate new payment for each request

### "Insufficient funds"
- Check wallet balance: `solana balance <address> --url devnet`
- Get more devnet SOL from faucet

## Next Steps

1. Read full documentation: `X402_INTEGRATION.md`
2. Check examples: `/examples` directory
3. Join Discord: https://discord.gg/taskblitz
4. Deploy your first AI agent!

## Support

Questions? support@taskblitz.click
