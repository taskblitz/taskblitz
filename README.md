# TaskBlitz - Solana Micro-Task Marketplace

TaskBlitz is a decentralized micro-task marketplace built on Solana, enabling instant crypto payments for completed work.

## 🚀 Features

- **Post Tasks**: Create micro-tasks with crypto rewards
- **Complete Work**: Browse and complete tasks to earn crypto instantly
- **Wallet Integration**: Seamless Solana wallet connection
- **Real-time Updates**: Live task progress and submission tracking
- **Glassmorphism UI**: Modern, elegant design with smooth animations

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Blockchain**: Solana (Devnet)
- **Wallet**: Solana Wallet Adapter
- **Styling**: Glassmorphism design system

## 🏗 Current Status

**MVP Phase** - Core functionality implemented:
- ✅ Task posting and browsing
- ✅ Work submission system
- ✅ User management
- ✅ Database integration
- ✅ Wallet connection
- 🔄 Smart contract integration (in progress)

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
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Setup

Run the SQL files in your Supabase SQL Editor in this order:
1. `supabase-setup.sql` - Create tables and policies
2. `supabase-simple-functions.sql` - Add RPC functions
3. `supabase-seed-data.sql` - Add sample data (optional)

## 🎨 Design System

TaskBlitz uses a custom glassmorphism design system:
- **Colors**: Purple-to-cyan gradients with dark theme
- **Cards**: Semi-transparent with backdrop blur
- **Animations**: Smooth hover effects and transitions
- **Typography**: Inter font family

## 🔗 Smart Contracts

Smart contracts are built with Anchor framework for Solana:
- Task escrow management
- Automatic payment distribution
- Dispute resolution system

## 📱 Deployment

The app is designed for deployment on Vercel with Supabase backend.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- **Live Demo**: Coming soon
- **Documentation**: Coming soon
- **Discord**: Coming soon

---

Built with ❤️ for the Solana ecosystem