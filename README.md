# TaskBlitz ⚡ - Solana Micro-Task Marketplace

> A decentralized micro-task marketplace built on Solana, enabling instant crypto payments for completed work.

[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?logo=solana)](https://explorer.solana.com/address/7UHcXx65GV3HP1VF24N8daSkqTuWMCXUeyCTNaMtQ4AE?cluster=devnet)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🚀 Features

### ✅ Implemented
- **🔗 Blockchain Integration**: Deployed Solana smart contract with escrow system
- **💰 Real Payments**: On-chain SOL transactions with verification
- **👛 Multi-Wallet Support**: Phantom, Solflare, and more via Wallet Adapter
- **📝 Task Management**: Create, browse, and complete micro-tasks
- **⚡ Real-time Updates**: Live submission tracking and notifications
- **🎨 Modern UI**: Glassmorphism design with smooth animations
- **🔐 Secure**: Wallet-based authentication and authorization
- **🤖 x402 Protocol**: AI agents can interact programmatically with automatic payments

### 🔄 In Progress
- Full Anchor IDL integration for proper escrow
- Task cancellation with automatic refunds
- Dispute resolution mechanism

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Blockchain**: Solana (Devnet), Anchor Framework, Rust
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Wallet**: Solana Wallet Adapter (multi-wallet support)
- **Styling**: Custom glassmorphism design system

## 🏗 Current Status

**MVP Complete** - Blockchain integration deployed:
- ✅ Smart contract deployed to Devnet
- ✅ Program ID: `7UHcXx65GV3HP1VF24N8daSkqTuWMCXUeyCTNaMtQ4AE`
- ✅ Task posting and browsing
- ✅ Work submission system
- ✅ Payment approval workflow
- ✅ On-chain transaction recording
- ✅ User management with wallet addresses
- ✅ Real-time notifications
- 🔄 Full escrow integration (next phase)

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/taskblitz.git
cd taskblitz
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=7UHcXx65GV3HP1VF24N8daSkqTuWMCXUeyCTNaMtQ4AE

# Platform
NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE=10
NEXT_PUBLIC_MIN_TASK_PAYMENT=0.10
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

7. Connect your Solana wallet (Phantom, Solflare, etc.) on Devnet

## 📊 Database Setup

Run the SQL files in your Supabase SQL Editor in this order:
1. `supabase-setup.sql` - Create tables and policies
2. `supabase-functions.sql` - Add RPC functions
3. `supabase-seed-data.sql` - Add sample data (optional)

## 🔐 Wallet Setup

1. Install a Solana wallet (Phantom recommended)
2. Switch to **Devnet** in wallet settings
3. Get Devnet SOL from [Solana Faucet](https://faucet.solana.com)
4. Connect wallet on TaskBlitz

## 🧪 Testing

### Test the Payment Flow:
1. Create a task (small amount like $0.50)
2. Submit work (same or different wallet)
3. Approve submission
4. Verify transaction on [Solana Explorer](https://explorer.solana.com/?cluster=devnet)

### Documentation:
- `SMART_CONTRACT_GUIDE.md` - Smart contract deployment
- `BLOCKCHAIN_INTEGRATION_COMPLETE.md` - Integration details
- `READY_TO_TEST.md` - Testing instructions
- `SOLANA_PLAYGROUND_DEPLOY.md` - Browser-based deployment

## 🎨 Design System

TaskBlitz uses a custom glassmorphism design system:
- **Colors**: Purple-to-cyan gradients with dark theme
- **Cards**: Semi-transparent with backdrop blur
- **Animations**: Smooth hover effects and transitions
- **Typography**: Inter font family

## 🔗 Smart Contracts

**Deployed on Solana Devnet**

Program ID: `7UHcXx65GV3HP1VF24N8daSkqTuWMCXUeyCTNaMtQ4AE`

Built with Anchor framework (Rust):
- ✅ Task creation with escrow locking
- ✅ Submission management
- ✅ Payment approval/rejection
- ✅ Platform fee collection (10%)
- ✅ Task cancellation with refunds
- ✅ PDA-based account management

**View on Explorer**: [Solana Explorer](https://explorer.solana.com/address/7UHcXx65GV3HP1VF24N8daSkqTuWMCXUeyCTNaMtQ4AE?cluster=devnet)

### Smart Contract Features:
- **Escrow System**: Funds locked until work approved
- **Automatic Payments**: SOL transfers on approval
- **Platform Fees**: 10% fee automatically deducted
- **Refund Mechanism**: Cancel tasks and refund remaining balance
- **Security**: PDA-based accounts with proper authorization

## 📱 Deployment

The app is designed for deployment on Vercel with Supabase backend.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 📈 Roadmap

### Phase 1: MVP ✅ (Complete)
- [x] Core UI/UX
- [x] Database integration
- [x] Wallet connection
- [x] Smart contract deployment
- [x] Basic payment flow

### Phase 2: x402 Integration ✅ (Complete)
- [x] x402 payment middleware
- [x] AI agent API endpoints
- [x] Programmatic task creation
- [x] Automatic payment handling
- [x] SDK for developers

### Phase 3: Escrow 🔄 (In Progress)
- [ ] Full Anchor IDL integration
- [ ] Proper escrow with program authority
- [ ] Automatic refunds on cancellation
- [ ] Enhanced error handling

### Phase 4: Production 📋 (Planned)
- [ ] Mainnet deployment
- [ ] Dispute resolution
- [ ] Rating system
- [ ] Advanced filtering
- [ ] Mobile app

## 🤖 x402 Integration

TaskBlitz now supports the **x402 protocol** - enabling AI agents to interact programmatically!

### Quick Example

```typescript
import { createTaskBlitzSDK } from '@taskblitz/sdk'

const sdk = createTaskBlitzSDK({
  apiUrl: 'https://taskblitz.click',
  privateKey: process.env.AI_AGENT_PRIVATE_KEY,
  network: 'devnet',
})

// AI agent creates a task (payment handled automatically)
const task = await sdk.createTask({
  title: 'Generate 100 memes',
  category: 'crypto_marketing',
  paymentPerTask: 5.0,
  workersNeeded: 100,
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
})
```

### Documentation

- **Full Guide**: See `X402_INTEGRATION.md`
- **Quick Start**: See `X402_QUICK_START.md`
- **Examples**: Check `/examples` directory
- **x402 Protocol**: https://x402.org

## 🔗 Links

- **Repository**: [github.com/taskblitz/taskblitz](https://github.com/taskblitz/taskblitz)
- **Smart Contract**: [Solana Explorer](https://explorer.solana.com/address/7UHcXx65GV3HP1VF24N8daSkqTuWMCXUeyCTNaMtQ4AE?cluster=devnet)
- **Live Demo**: Coming soon
- **Documentation**: See `/docs` folder

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the Solana ecosystem**

*TaskBlitz - Where micro-tasks meet instant crypto payments* ⚡