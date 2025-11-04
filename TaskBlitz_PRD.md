# TaskBlitz Platform - Product Requirements Document (PRD)

**Version:** 1.0  
**Last Updated:** October 31, 2025  
**Project:** TaskBlitz - Solana-Based Micro-Task Marketplace  
**Domain:** TaskBlitz.click  
**Token:** $TASK (launching on Pump.Fun)

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Stack](#technical-stack)
3. [Design System](#design-system)
4. [Database Schema](#database-schema)
5. [Core Features](#core-features)
6. [User Flows](#user-flows)
7. [Smart Contract Requirements](#smart-contract-requirements)
8. [Implementation Checklist](#implementation-checklist)
9. [Setup Instructions](#setup-instructions)

---

## Project Overview

### Mission
Build the first crypto-native micro-task marketplace on Solana where requesters can post tasks, workers complete them, and payments happen instantly in crypto.

### Key Differentiators
- **Instant crypto payments** (vs MTurk's 7+ day delays)
- **10% platform fee** (vs MTurk's 20-40%)
- **Global workforce** (anyone with Solana wallet)
- **Built for crypto marketing** (memes, KOL outreach, raids, content)
- **Token economy** ($TASK holders get fee discounts and revenue share)

### Business Model
- Platform charges **10% fee** on top of task payment
- Requester pays: Task Amount + 10% Platform Fee
- On approval: Worker gets Task Amount, Platform gets 10% fee
- Future: $TASK holders get 50% fee discount (5% instead of 10%)

### Target Users
- **Requesters:** Crypto projects, startups, e-commerce brands, researchers, AI companies
- **Workers:** Global workforce seeking crypto side income, especially from emerging markets
- **Token Holders:** Investors and users who want passive income from platform revenue

---

## Technical Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Charts:** Recharts (for analytics)
- **Wallet Integration:** @solana/wallet-adapter-react

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth + Wallet signing
- **File Storage:** Supabase Storage
- **Edge Functions:** Supabase Edge Functions (for escrow triggers)
- **Real-time:** Supabase Realtime subscriptions

### Blockchain
- **Network:** Solana Mainnet (Devnet for testing)
- **Framework:** Anchor (for smart contracts)
- **Wallet Support:** Phantom, Solflare
- **Currency:** SOL and USDC (SPL tokens)

### Deployment
- **Frontend Hosting:** Vercel
- **Domain:** TaskBlitz.click
- **SSL:** Automatic (Vercel)

### Development Tools
- **IDE:** Cursor AI / Kiro / Windsurf
- **Version Control:** Git + GitHub
- **Package Manager:** npm or pnpm

---

## Design System

### Visual Direction
Create a modern, professional crypto interface combining the aesthetics of:
- **Jupiter Aggregator** (clean, fast Solana dApp)
- **Phantom Wallet** (polished crypto UI)
- **Linear** (task management clarity)
- **Stripe** (professional SaaS aesthetic)

### Color Palette

```css
/* Primary Colors */
--purple-primary: #8b5cf6;
--purple-dark: #7c3aed;
--cyan-accent: #06b6d4;
--cyan-light: #22d3ee;

/* Backgrounds */
--bg-darkest: #0a0a0a;
--bg-dark: #1a1a1a;
--bg-card: rgba(255, 255, 255, 0.05);
--bg-hover: rgba(255, 255, 255, 0.1);

/* Text */
--text-primary: #ffffff;
--text-secondary: #a1a1aa;
--text-muted: #71717a;

/* Borders */
--border-subtle: rgba(255, 255, 255, 0.1);
--border-focus: rgba(139, 92, 246, 0.5);

/* Status Colors */
--success: #22c55e;
--warning: #eab308;
--error: #ef4444;
--info: #3b82f6;
```

### Typography
- **Font Family:** Inter or Satoshi Variable
- **Headings:** Bold (700)
- **Body:** Regular (400) and Medium (500)
- **Code/Numbers:** Mono font for transaction hashes and wallet addresses

### Component Styles

#### Buttons
**Primary Button:**
```tsx
className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-transform shadow-lg hover:shadow-purple-500/50"
```

**Secondary Button:**
```tsx
className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all"
```

**Ghost Button:**
```tsx
className="text-purple-400 hover:text-purple-300 hover:underline transition-colors"
```

#### Cards (Glassmorphism)
```tsx
className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-[1.02] transition-all duration-200 shadow-xl"
```

#### Input Fields
```tsx
className="bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg px-4 py-3 w-full transition-all"
```

### Layout Principles
- **Spacing:** Use TailwindCSS spacing scale (4px increments)
- **Max Width:** 1400px for main content
- **Grid:** 12-column grid for layouts
- **Breakpoints:**
  - Mobile: < 768px (1 column)
  - Tablet: 768px - 1024px (2 columns)
  - Desktop: > 1024px (3+ columns)

### Animations
- **Hover States:** Scale to 105%, add glow shadow
- **Loading:** Skeleton screens with shimmer effect
- **Success:** Checkmark animation with scale bounce
- **Page Transitions:** Fade in with 200ms duration
- **Modals:** Slide up from bottom with backdrop blur

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('requester', 'worker', 'both')) DEFAULT 'both',
  total_spent DECIMAL(10,2) DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,
  tasks_posted INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  reputation_score DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('crypto_marketing', 'content', 'data', 'testing', 'ecommerce', 'other')),
  payment_per_task DECIMAL(10,2) NOT NULL CHECK (payment_per_task >= 0.10),
  workers_needed INTEGER NOT NULL CHECK (workers_needed > 0),
  workers_completed INTEGER DEFAULT 0,
  deadline TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'expired', 'cancelled')),
  escrow_amount DECIMAL(10,2) NOT NULL,
  platform_fee_percentage DECIMAL(5,2) DEFAULT 10.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Submissions Table
```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  submission_type TEXT CHECK (submission_type IN ('text', 'file', 'url')),
  submission_text TEXT,
  submission_file_url TEXT,
  submission_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  payment_transaction_hash TEXT,
  UNIQUE(task_id, worker_id)
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_type TEXT CHECK (transaction_type IN ('deposit', 'payment', 'fee', 'refund', 'withdrawal')),
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  task_id UUID REFERENCES tasks(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SOL' CHECK (currency IN ('SOL', 'USDC')),
  solana_tx_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Platform Settings Table (Admin)
```sql
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO platform_settings (setting_key, setting_value) VALUES
('platform_fee_percentage', '10'),
('minimum_task_payment', '0.10'),
('platform_wallet_address', 'YOUR_SOLANA_WALLET_ADDRESS_HERE');
```

### Indexes for Performance
```sql
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_requester ON tasks(requester_id);
CREATE INDEX idx_submissions_task ON submissions(task_id);
CREATE INDEX idx_submissions_worker ON submissions(worker_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_transactions_user ON transactions(from_user_id);
CREATE INDEX idx_users_wallet ON users(wallet_address);
```

---

## Core Features

### 1. Wallet Authentication

**User Flow:**
1. User clicks "Connect Wallet" button in header
2. Modal appears with wallet options (Phantom, Solflare)
3. User selects wallet → wallet extension opens
4. User approves connection
5. User signs a message to verify wallet ownership
6. Session created, wallet address stored
7. Header updates to show truncated address (e.g., "0x1234...5678")
8. Dropdown menu for Disconnect option

**Technical Implementation:**
```tsx
// Use @solana/wallet-adapter-react
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Sign message for authentication
const signMessage = async () => {
  const message = `Sign this message to authenticate with TaskBlitz: ${Date.now()}`;
  const encodedMessage = new TextEncoder().encode(message);
  const signature = await wallet.signMessage(encodedMessage);

  // Send to Supabase to create session
  await supabase.auth.signInWithCustomToken({
    wallet_address: wallet.publicKey.toString(),
    signature: signature,
    message: message
  });
};
```

**Database Action:**
- Check if user exists in `users` table by `wallet_address`
- If not exists, create new user record
- Update `updated_at` timestamp on login

---

### 2. Task Posting (Requester)

**Page:** `/post-task`

**Form Fields:**
1. **Task Title** (text input, required, max 100 chars)
2. **Task Description** (textarea, required, max 1000 chars)
3. **Category** (dropdown, required)
   - Options: Crypto Marketing, Content Creation, Data & AI Training, Testing & QA, E-commerce, Other
4. **Payment Per Task** (number input, min $0.10, required)
5. **Number of Workers Needed** (number input, min 1, max 1000, required)
6. **Deadline** (dropdown, required)
   - Options: 24 hours, 3 days, 7 days, 14 days
7. **Proof Submission Type** (dropdown, required)
   - Options: Text Response, File Upload, URL/Link, Multiple Choice

**Live Cost Calculator:**
Display as user types:
```
Task Payment: $5.00
× Workers Needed: 100
= Worker Payments: $500.00
+ Platform Fee (10%): $50.00
─────────────────────
TOTAL DEPOSIT: $550.00
```

**Submit Flow:**
1. User clicks "Preview Task" → Shows preview modal
2. User clicks "Deposit & Post Task"
3. Wallet popup requests approval for $550.00 SOL/USDC
4. Transaction sent to escrow smart contract
5. Wait for blockchain confirmation (show loading state)
6. On confirmation: Create task in database with status 'open'
7. Show success message: "Task posted! View in dashboard"
8. Redirect to requester dashboard

**Database Actions:**
1. Insert task into `tasks` table
2. Insert deposit transaction into `transactions` table
3. Update `requester.tasks_posted` count
4. Update `requester.total_spent`

**Validation Rules:**
- All fields required
- Payment must be ≥ $0.10
- Workers needed > 0
- Total cost must not exceed wallet balance
- Description must be clear (check for spam patterns)

---

### 3. Task Marketplace (Worker)

**Page:** `/marketplace`

**Layout:**
- **Left Sidebar (Desktop):** Filters
  - Category checkboxes
  - Payment range slider ($0.10 - $100+)
  - Time remaining (Ending soon, 1-3 days, 3+ days)
  - Clear all filters button
- **Top Bar:**
  - Search input (searches title and description)
  - Sort dropdown: Highest Pay, Newest, Ending Soon
  - "Post Task" CTA button (sticky, always visible)
- **Main Content:** Grid of task cards (3 columns desktop, 2 tablet, 1 mobile)

**Task Card Design:**
```
┌──────────────────────────────────┐
│ 🎨 Crypto Marketing    [SOL icon]│
│                                  │
│ Create 10 Memes About $TASK     │
│ Need viral memes for X campaign │
│                                  │
│ 💰 $5.00/task     ⏰ 2 days left │
│ 📊 42/100 completed              │
│                                  │
│ [View Details →]                 │
└──────────────────────────────────┘
```

**Card States:**
- **Default:** White/5 background, white/10 border
- **Hover:** Scale 102%, glow shadow, cursor pointer
- **Urgent (< 24h left):** Yellow border, pulsing animation
- **Almost Full (>90% filled):** Orange "Hurry!" badge

**Click Behavior:**
- Clicking card opens Task Detail Modal (doesn't navigate to new page)
- "View Details" button also opens modal

**Empty State:**
If no tasks match filters:
```
🔍 No Tasks Found

Try adjusting your filters or check back later.
New tasks are posted every hour.

[Clear Filters] [Get Notified]
```

**Loading State:**
Show 6 skeleton cards with shimmer animation while fetching

**Database Query:**
```sql
SELECT 
  tasks.*,
  users.wallet_address as requester_wallet,
  (workers_needed - workers_completed) as spots_remaining
FROM tasks
LEFT JOIN users ON tasks.requester_id = users.id
WHERE tasks.status = 'open'
  AND tasks.deadline > NOW()
  AND tasks.workers_completed < tasks.workers_needed
ORDER BY [sort_criteria]
LIMIT 50;
```

---

### 4. Task Detail Modal

**Trigger:** Click any task card in marketplace

**Modal Layout:**
- **Header:**
  - Task title (large, bold)
  - Category tag
  - Close X button (top right)
- **Body (scrollable):**
  - Payment amount (large, prominent)
  - Requester address (truncated, copyable)
  - Time remaining (countdown)
  - Spots remaining (e.g., "58/100 available")
  - Full description
  - Submission type required
  - Example submission (if provided by requester)
- **Footer:**
  - Total tasks completed by requester (credibility)
  - "Accept Task" button (primary, large, full width)

**Accept Task Logic:**
1. Check if user already accepted this task → Show "Already accepted"
2. Check if all spots filled → Show "Task full"
3. Check if task expired → Show "Task expired"
4. If valid: Close modal, navigate to `/task/[id]/submit`

**Responsive:**
- Desktop: Modal centered, max-width 800px
- Mobile: Full screen modal, slide up from bottom

---

### 5. Task Submission (Worker)

**Page:** `/task/[id]/submit`

**Layout:**
- **Top Section:** Task summary (title, payment, deadline)
- **Main Section:** Submission form based on type

**Submission Types:**

**A. Text Response:**
```tsx
<textarea 
  placeholder="Paste your tweet URL, answer, or response here..."
  className="w-full h-40 bg-white/5 border border-white/10 rounded-lg p-4"
  maxLength={1000}
/>
```

**B. File Upload:**
```tsx
<div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
  <p>Drag and drop file here or click to browse</p>
  <p className="text-sm text-gray-500">Max 10MB • Images or PDFs only</p>
  <input type="file" accept="image/*,.pdf" />
</div>
```

**C. URL/Link:**
```tsx
<input 
  type="url"
  placeholder="https://twitter.com/user/status/123456"
  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3"
/>
```

**Submit Button:**
```tsx
<button className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold py-4 rounded-xl">
  Submit Work for Review
</button>
```

**Submit Flow:**
1. Validate submission (not empty, file size check)
2. If file: Upload to Supabase Storage first, get URL
3. Insert record into `submissions` table with status 'pending'
4. Update `tasks.workers_completed` count
5. Show success message: "Submitted! You'll be notified when reviewed."
6. Redirect to worker dashboard

**Database Actions:**
1. Insert into `submissions` table:
   - task_id
   - worker_id
   - submission_type
   - submission_text / submission_file_url / submission_url
   - status = 'pending'
   - submitted_at = NOW()
2. Increment `tasks.workers_completed`
3. If `workers_completed == workers_needed`, update task status to 'in_progress'

**Auto-Approval (72 hours):**
- Use Supabase Edge Function or cron job
- Check for submissions where `status = 'pending'` and `submitted_at < NOW() - INTERVAL '72 hours'`
- Automatically approve and trigger payment

---

### 6. Review & Approval (Requester)

**Page:** `/dashboard/requester`

**Dashboard Sections:**
1. **Stats Cards (Top):**
   - Total Spent
   - Active Tasks
   - Pending Reviews (highlighted)
   - Completed Tasks

2. **Pending Reviews (Priority Section):**
   - List of tasks with pending submissions
   - Badge showing count (e.g., "3 submissions awaiting review")
   - Click to expand and see submissions

**Review Interface:**
```
┌────────────────────────────────────────┐
│ Task: Create Meme About $TASK          │
│ Worker: 0x1234...5678                  │
│ Submitted: 2 hours ago                 │
├────────────────────────────────────────┤
│                                        │
│ [Submission Preview]                   │
│ • Text: "Here's the meme..."          │
│ • File: [View Image]                  │
│ • URL: https://twitter.com/...        │
│                                        │
├────────────────────────────────────────┤
│ [✅ Approve] [❌ Reject]               │
└────────────────────────────────────────┘
```

**Approve Flow:**
1. Requester clicks "✅ Approve"
2. Trigger smart contract payment function:
   - Transfer task payment to worker wallet
   - Transfer platform fee (10%) to platform wallet
3. Update submission status to 'approved'
4. Insert payment transaction records
5. Show success: "Payment sent! Transaction: [hash]"

**Reject Flow:**
1. Requester clicks "❌ Reject"
2. Show confirmation: "Are you sure? This work will not be paid."
3. Update submission status to 'rejected'
4. Task reopens for another worker to claim
5. Notify worker (optional Phase 2 feature)

**Database Actions (Approval):**
1. Update `submissions.status` = 'approved'
2. Update `submissions.reviewed_at` = NOW()
3. Update `submissions.payment_transaction_hash` = [tx_hash]
4. Insert into `transactions`:
   - Worker payment record
   - Platform fee record
5. Update `users.total_earned` for worker
6. Update task status to 'completed' if all workers paid

---

### 7. Payment System (Smart Contract)

**Escrow Smart Contract (Anchor/Solana):**

**Key Functions:**

**A. Initialize Escrow**
```rust
pub fn initialize_escrow(
    ctx: Context<InitializeEscrow>,
    total_amount: u64,
    workers_needed: u8,
    platform_fee_bps: u16, // basis points (1000 = 10%)
) -> Result<()> {
    // Transfer funds from requester to escrow PDA
    // Store task details in escrow account
    // Emit TaskCreated event
}
```

**B. Release Payment (On Approval)**
```rust
pub fn release_payment(
    ctx: Context<ReleasePayment>,
    submission_id: String,
) -> Result<()> {
    // Calculate amounts
    let worker_payment = task.payment_per_task;
    let platform_fee = (worker_payment * platform_fee_bps) / 10000;

    // Transfer worker_payment to worker wallet
    // Transfer platform_fee to platform wallet
    // Update escrow state
    // Emit PaymentReleased event
}
```

**C. Refund (Cancelled/Expired)**
```rust
pub fn refund_escrow(
    ctx: Context<RefundEscrow>,
    task_id: String,
) -> Result<()> {
    // Calculate unused funds
    let remaining = escrow.total_amount - escrow.paid_amount;

    // Transfer remaining back to requester
    // Close escrow account
    // Emit TaskCancelled event
}
```

**Platform Wallet Address:**
- Stored in `platform_settings` table
- Hardcoded in smart contract (upgradeable)
- Must be multi-sig for production (Phase 2)

**Supported Currencies:**
- SOL (native)
- USDC (SPL token)

**Transaction Monitoring:**
- Listen to smart contract events
- Update database when payments confirmed
- Show transaction hash in UI (link to Solscan)

---

### 8. Worker Dashboard

**Page:** `/dashboard/worker`

**Stats Cards:**
- **Total Earned** (lifetime, large number)
- **Tasks Completed** (count)
- **Pending Reviews** (awaiting approval)
- **Available Balance** (if any held funds - Phase 2)

**Recent Activity:**
- Table showing recent submissions:
  - Task Title
  - Amount
  - Status (Pending / Approved / Rejected)
  - Submitted Date
  - Action (View / N/A if reviewed)

**Available Tasks Section:**
- Quick access to marketplace
- "Browse New Tasks" CTA button

**Withdrawal (Phase 2):**
- For now, all payments go directly to wallet
- No withdrawal needed unless $TASK staking rewards

---

### 9. Requester Dashboard

**Page:** `/dashboard/requester`

**Stats Cards:**
- **Total Spent**
- **Active Tasks**
- **Pending Reviews** (highlighted if > 0)
- **Average Approval Time**

**Active Tasks:**
- List of all posted tasks
- Status indicators
- Progress bars (X/Y completed)
- Click to view submissions

**Completed Tasks:**
- Archive of past tasks
- Export data option (CSV - Phase 2)

---

### 10. Admin Analytics Panel

**Page:** `/admin` (protected route, check wallet address against admin list)

**Real-Time Stats (Cards):**
```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ 💰              │ │ 👥              │ │ 📝              │ │ ✅              │
│ $247,391        │ │ 1,243           │ │ 45,892          │ │ 38,771          │
│ Total Volume    │ │ Total Users     │ │ Tasks Posted    │ │ Completed       │
│ ↗ +23% today   │ │ ↗ +156 today   │ │ ↗ +892 today   │ │ ↗ +743 today   │
└──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘
```

**Charts:**
1. **Daily Volume (Line Chart):** Last 30 days transaction volume
2. **User Growth (Area Chart):** Requesters vs Workers over time
3. **Task Completion Rate (Bar Chart):** Daily completion rates
4. **Category Distribution (Pie Chart):** Which categories are most popular

**Tables:**
1. **Recent Transactions:** Last 50 transactions with amounts and status
2. **Top Requesters:** By total spent
3. **Top Workers:** By total earned

**Admin Settings (Editable):**
- **Platform Fee %:** Slider from 5% to 20% (default 10%)
- **Minimum Task Payment:** Input field (default $0.10)
- **Platform Wallet Address:** Display only (not editable in UI)

**Export Functions:**
- Export all data as CSV
- Export filtered date ranges

**Database Queries:**
```sql
-- Total Volume
SELECT SUM(amount) FROM transactions WHERE transaction_type = 'payment';

-- Total Platform Revenue
SELECT SUM(amount) FROM transactions WHERE transaction_type = 'fee';

-- Daily stats
SELECT DATE(created_at) as date, 
       COUNT(*) as task_count,
       SUM(escrow_amount) as volume
FROM tasks
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at);
```

---

## User Flows

### Flow 1: Requester Posts First Task

1. **Connect Wallet** → Phantom extension opens → Approve connection → Sign message
2. **Land on Homepage** → Click "Post Task" button
3. **Fill Form:**
   - Title: "Create 10 viral memes about $TASK"
   - Description: "Need funny, shareable memes for Twitter..."
   - Category: Crypto Marketing
   - Payment: $5.00
   - Workers: 100
   - Deadline: 7 days
4. **See Total Cost:** $550.00 (100 × $5 + 10% fee)
5. **Click "Post Task"** → Wallet approval popup → Approve $550 SOL
6. **Wait for confirmation** (loading spinner)
7. **Success!** → "Task posted!" → Redirect to dashboard
8. **Dashboard shows:**
   - Active Tasks: 1
   - Pending Reviews: 0
   - Task card with 0/100 completed

### Flow 2: Worker Completes First Task

1. **Connect Wallet** → Sign message
2. **Land on Marketplace** → Browse task cards
3. **Click Task Card** → Modal opens with details
4. **Click "Accept Task"** → Navigate to submission page
5. **Upload meme file** → Click "Submit Work"
6. **Success!** → "Submitted for review"
7. **Dashboard shows:**
   - Tasks Completed: 0
   - Pending Reviews: 1
   - Status: "Waiting for approval"
8. **Wait for requester approval** (up to 72 hours)
9. **Receive notification:** "Payment approved!"
10. **Check wallet:** $5.00 received instantly

### Flow 3: Task Lifecycle (Full Cycle)

1. **Requester posts task** → Funds locked in escrow
2. **Task appears in marketplace** → Status: Open
3. **Worker 1 accepts & submits** → Status: In Progress (1/100)
4. **Worker 2-100 submit** → Status: In Progress (100/100)
5. **Requester reviews submissions:**
   - Approves 95 → Payments sent instantly
   - Rejects 5 → Tasks reopen for new workers
6. **New workers fill rejected spots**
7. **All 100 approved** → Task status: Completed
8. **Task archived** → No longer in marketplace

---

## Smart Contract Requirements

### Contract Architecture

**Program:** TaskBlitz Escrow (Anchor Framework)

**Accounts:**
1. **Escrow Account (PDA):**
   - Stores locked funds
   - Tracks task details
   - Owner: TaskBlitz program

2. **Platform Config Account:**
   - Platform wallet address
   - Default fee percentage
   - Admin authority

**Instructions:**

### 1. Initialize Platform
```rust
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 2 + 32,
        seeds = [b"platform-config"],
        bump
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct PlatformConfig {
    pub authority: Pubkey,
    pub platform_wallet: Pubkey,
    pub default_fee_bps: u16, // 1000 = 10%
}
```

### 2. Create Task Escrow
```rust
pub struct CreateEscrow<'info> {
    #[account(
        init,
        payer = requester,
        space = 8 + 32 + 32 + 8 + 8 + 2 + 2 + 1 + 32,
        seeds = [b"escrow", task_id.as_bytes()],
        bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub requester: Signer<'info>,

    /// CHECK: Escrow's token account
    #[account(mut)]
    pub escrow_token_account: AccountInfo<'info>,

    pub platform_config: Account<'info, PlatformConfig>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Escrow {
    pub requester: Pubkey,
    pub task_id: String,
    pub total_amount: u64,
    pub payment_per_worker: u64,
    pub workers_needed: u16,
    pub workers_paid: u16,
    pub fee_bps: u16,
    pub bump: u8,
}
```

### 3. Release Payment
```rust
pub struct ReleasePayment<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow.task_id.as_bytes()],
        bump = escrow.bump,
        constraint = escrow.workers_paid < escrow.workers_needed
    )]
    pub escrow: Account<'info, Escrow>,

    /// CHECK: Worker receiving payment
    #[account(mut)]
    pub worker: AccountInfo<'info>,

    #[account(mut)]
    pub platform_wallet: AccountInfo<'info>,

    /// CHECK: Escrow's token account
    #[account(mut)]
    pub escrow_token_account: AccountInfo<'info>,

    #[account(mut)]
    pub requester: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

// Implementation
pub fn release_payment(ctx: Context<ReleasePayment>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;

    // Calculate amounts
    let worker_amount = escrow.payment_per_worker;
    let fee_amount = (worker_amount * escrow.fee_bps as u64) / 10000;

    // Transfer to worker
    transfer_from_escrow(
        ctx.accounts.escrow_token_account.to_account_info(),
        ctx.accounts.worker.to_account_info(),
        worker_amount,
        &escrow.task_id,
        escrow.bump
    )?;

    // Transfer fee to platform
    transfer_from_escrow(
        ctx.accounts.escrow_token_account.to_account_info(),
        ctx.accounts.platform_wallet.to_account_info(),
        fee_amount,
        &escrow.task_id,
        escrow.bump
    )?;

    // Update state
    escrow.workers_paid += 1;

    emit!(PaymentReleased {
        task_id: escrow.task_id.clone(),
        worker: ctx.accounts.worker.key(),
        amount: worker_amount,
        fee: fee_amount,
    });

    Ok(())
}
```

### 4. Cancel/Refund Task
```rust
pub struct CancelTask<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow.task_id.as_bytes()],
        bump = escrow.bump,
        close = requester
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        constraint = requester.key() == escrow.requester
    )]
    pub requester: Signer<'info>,

    /// CHECK: Escrow's token account
    #[account(mut)]
    pub escrow_token_account: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn cancel_task(ctx: Context<CancelTask>) -> Result<()> {
    let escrow = &ctx.accounts.escrow;

    // Calculate refund (total - already paid)
    let paid_amount = (escrow.payment_per_worker * escrow.workers_paid as u64) 
                     + ((escrow.payment_per_worker * escrow.workers_paid as u64 * escrow.fee_bps as u64) / 10000);
    let refund_amount = escrow.total_amount - paid_amount;

    // Transfer remaining funds back to requester
    transfer_from_escrow(
        ctx.accounts.escrow_token_account.to_account_info(),
        ctx.accounts.requester.to_account_info(),
        refund_amount,
        &escrow.task_id,
        escrow.bump
    )?;

    emit!(TaskCancelled {
        task_id: escrow.task_id.clone(),
        refund_amount,
    });

    Ok(())
}
```

### Events
```rust
#[event]
pub struct TaskCreated {
    pub task_id: String,
    pub requester: Pubkey,
    pub total_amount: u64,
}

#[event]
pub struct PaymentReleased {
    pub task_id: String,
    pub worker: Pubkey,
    pub amount: u64,
    pub fee: u64,
}

#[event]
pub struct TaskCancelled {
    pub task_id: String,
    pub refund_amount: u64,
}
```

---

## Implementation Checklist

### Phase 0: Setup
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Install dependencies (TailwindCSS, Radix UI, Lucide, Framer Motion, Solana wallet adapter)
- [ ] Set up Supabase project and get credentials
- [ ] Configure environment variables (.env.local)
- [ ] Set up Git repository
- [ ] Deploy empty project to Vercel (test deployment pipeline)

### Phase 1: Design System & Layout
- [ ] Configure TailwindCSS with custom color palette
- [ ] Create base layout component (header, footer, container)
- [ ] Build wallet connection button component
- [ ] Create reusable button components (Primary, Secondary, Ghost)
- [ ] Build card component with glassmorphism style
- [ ] Create input/textarea components with focus states
- [ ] Build modal component (used for task details, confirmations)
- [ ] Add toast notification system (react-hot-toast)
- [ ] Create loading skeleton components
- [ ] Test responsive breakpoints (mobile, tablet, desktop)

### Phase 2: Authentication
- [ ] Integrate @solana/wallet-adapter-react
- [ ] Create WalletProvider wrapper for app
- [ ] Build wallet connection modal with Phantom/Solflare options
- [ ] Implement message signing for authentication
- [ ] Connect Supabase auth with wallet signature
- [ ] Create protected route wrapper (check auth before rendering)
- [ ] Build user profile creation flow
- [ ] Store wallet address in users table on first login
- [ ] Add disconnect wallet functionality
- [ ] Test auth flow end-to-end

### Phase 3: Database
- [ ] Create Supabase database tables (users, tasks, submissions, transactions, platform_settings)
- [ ] Add indexes for performance
- [ ] Insert default platform settings (fee = 10%, min payment = $0.10)
- [ ] Create Row Level Security (RLS) policies
- [ ] Test database queries from frontend
- [ ] Set up Supabase Storage bucket for file uploads
- [ ] Configure CORS and bucket permissions

### Phase 4: Task Posting
- [ ] Create /post-task page with form
- [ ] Build form fields (title, description, category, payment, workers, deadline)
- [ ] Add form validation (Zod or React Hook Form)
- [ ] Build live cost calculator component
- [ ] Create task preview modal
- [ ] Implement deposit flow (wallet transaction)
- [ ] Connect to escrow smart contract (initialize_escrow)
- [ ] Wait for blockchain confirmation
- [ ] Insert task into database on confirmation
- [ ] Show success state and redirect to dashboard
- [ ] Test with Devnet SOL

### Phase 5: Task Marketplace
- [ ] Create /marketplace page layout
- [ ] Build filters sidebar (category, payment range, time)
- [ ] Build search bar with debounced input
- [ ] Create sort dropdown (highest pay, newest, ending soon)
- [ ] Build task card component
- [ ] Fetch tasks from database with filters/sort
- [ ] Implement pagination or infinite scroll
- [ ] Add loading skeleton state
- [ ] Add empty state (no tasks found)
- [ ] Test filter combinations

### Phase 6: Task Details & Acceptance
- [ ] Create task detail modal component
- [ ] Fetch single task details on card click
- [ ] Display all task information
- [ ] Build "Accept Task" button with validation
- [ ] Check if user already accepted task
- [ ] Check if task is full or expired
- [ ] Navigate to submission page on accept
- [ ] Add countdown timer component for deadline

### Phase 7: Task Submission
- [ ] Create /task/[id]/submit page
- [ ] Build text submission form
- [ ] Build file upload component (drag & drop)
- [ ] Integrate Supabase Storage for files
- [ ] Build URL submission form
- [ ] Add submission validation
- [ ] Insert submission into database
- [ ] Update task workers_completed count
- [ ] Show success message
- [ ] Redirect to worker dashboard

### Phase 8: Review & Approval
- [ ] Create requester dashboard page
- [ ] Build stats cards component
- [ ] Fetch pending submissions for requester's tasks
- [ ] Build submission review interface
- [ ] Add approve button → trigger smart contract payment
- [ ] Add reject button → update status in database
- [ ] Show transaction confirmation
- [ ] Display transaction hash with Solscan link
- [ ] Update UI after approval/rejection
- [ ] Test payment flow end-to-end

### Phase 9: Worker Dashboard
- [ ] Create worker dashboard page
- [ ] Build worker stats cards
- [ ] Fetch worker's submissions with status
- [ ] Display recent activity table
- [ ] Add quick link to marketplace
- [ ] Show pending reviews count

### Phase 10: Admin Analytics
- [ ] Create /admin page (protected)
- [ ] Build real-time stats cards
- [ ] Fetch aggregated data (total volume, users, tasks)
- [ ] Build charts (Recharts library)
- [ ] Create admin settings form (editable fee %)
- [ ] Add export to CSV functionality
- [ ] Test admin queries performance

### Phase 11: Smart Contract
- [ ] Set up Anchor project
- [ ] Write platform config initialization
- [ ] Write escrow account creation
- [ ] Write release payment function
- [ ] Write cancel/refund function
- [ ] Add events for tracking
- [ ] Test on Localnet
- [ ] Deploy to Devnet
- [ ] Test all functions with frontend
- [ ] Audit contract code
- [ ] Deploy to Mainnet (after testing)

### Phase 12: Integrations
- [ ] Connect frontend to deployed smart contract
- [ ] Test deposit transactions
- [ ] Test payment release transactions
- [ ] Test refund transactions
- [ ] Add transaction monitoring (listen to events)
- [ ] Update database on blockchain events
- [ ] Test with both SOL and USDC

### Phase 13: Polish & UX
- [ ] Add loading states everywhere
- [ ] Add error handling and user-friendly messages
- [ ] Test all user flows on mobile
- [ ] Add animations (hover, transitions, page loads)
- [ ] Optimize images and assets
- [ ] Test accessibility (keyboard navigation, contrast)
- [ ] Add meta tags and SEO (next-seo)
- [ ] Create 404 and error pages
- [ ] Test on different browsers
- [ ] Fix any UI bugs or inconsistencies

### Phase 14: Security & Validation
- [ ] Add rate limiting (max 10 actions per minute per user)
- [ ] Validate all user inputs on backend
- [ ] Prevent SQL injection (use parameterized queries)
- [ ] Add wallet signature verification on all protected actions
- [ ] Test for XSS vulnerabilities
- [ ] Add CSRF protection
- [ ] Review Supabase RLS policies
- [ ] Test payment logic for edge cases (insufficient funds, cancelled tasks)
- [ ] Add monitoring and error logging (Sentry)

### Phase 15: Testing & QA
- [ ] Test entire requester flow (post task → review → approve)
- [ ] Test entire worker flow (browse → accept → submit → get paid)
- [ ] Test admin panel with real data
- [ ] Test with multiple users simultaneously
- [ ] Test payment flows with small amounts on Devnet
- [ ] Test cancellation and refund flows
- [ ] Test edge cases (task expires, no workers, all rejected)
- [ ] Fix all bugs found during testing
- [ ] Get feedback from beta testers
- [ ] Make final adjustments

### Phase 16: Deployment
- [ ] Set environment variables in Vercel
- [ ] Connect custom domain (TaskBlitz.click)
- [ ] Deploy to production
- [ ] Test production site
- [ ] Monitor for errors
- [ ] Set up uptime monitoring
- [ ] Create backup plan for database

### Phase 17: Launch Preparation
- [ ] Record demo video of platform working
- [ ] Take screenshots of all major features
- [ ] Write launch announcement for X
- [ ] Prepare Telegram community messages
- [ ] Set up analytics (Plausible or Google Analytics)
- [ ] Create launch livestream plan
- [ ] Test everything one final time
- [ ] Launch! 🚀

---

## Setup Instructions

### Prerequisites
```bash
# Install Node.js 18+
node --version

# Install pnpm (optional, can use npm)
npm install -g pnpm

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### Step 1: Create Next.js Project
```bash
npx create-next-app@latest taskblitz --typescript --tailwind --app --use-pnpm
cd taskblitz
```

### Step 2: Install Dependencies
```bash
pnpm add @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tabs
pnpm add lucide-react framer-motion recharts
pnpm add react-hook-form zod @hookform/resolvers
pnpm add date-fns class-variance-authority clsx tailwind-merge
pnpm add react-hot-toast
```

### Step 3: Configure Supabase
1. Go to supabase.com and create project
2. Copy project URL and anon key
3. Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_ESCROW_PROGRAM_ID=your_program_id_here
```

4. Run database migration (copy SQL from Database Schema section)
5. Enable Realtime in Supabase dashboard

### Step 4: Configure TailwindCSS
Update `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'purple-primary': '#8b5cf6',
        'purple-dark': '#7c3aed',
        'cyan-accent': '#06b6d4',
        'cyan-light': '#22d3ee',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
export default config
```

### Step 5: Create Wallet Provider
Create `components/WalletProvider.tsx`:
```typescript
'use client'
import { FC, ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

require('@solana/wallet-adapter-react-ui/styles.css')

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'
  const endpoint = useMemo(() => clusterApiUrl(network as any), [network])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
```

### Step 6: Wrap App with Providers
Update `app/layout.tsx`:
```typescript
import { WalletContextProvider } from '@/components/WalletProvider'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white min-h-screen">
        <WalletContextProvider>
          {children}
          <Toaster position="top-right" />
        </WalletContextProvider>
      </body>
    </html>
  )
}
```

### Step 7: Initialize Anchor Project (Smart Contract)
```bash
# In separate folder
anchor init taskblitz-escrow
cd taskblitz-escrow

# Copy smart contract code from Smart Contract Requirements section
# to programs/taskblitz-escrow/src/lib.rs

# Build
anchor build

# Deploy to Devnet
anchor deploy

# Copy Program ID to NEXT_PUBLIC_ESCROW_PROGRAM_ID in .env.local
```

### Step 8: Create Supabase Client
Create `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Step 9: Start Development
```bash
pnpm dev
# Open http://localhost:3000
```

### Step 10: Deploy to Vercel
```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add custom domain in Vercel dashboard
```

---

## Next Steps for You

### Before You Start Coding:

1. **Create Supabase Project**
   - Sign up at supabase.com
   - Create new project
   - Copy credentials to .env.local
   - Run database SQL migration

2. **Set Up Solana Wallet**
   - Install Phantom wallet extension
   - Switch to Devnet
   - Get Devnet SOL from faucet (solana airdrop 2)

3. **Prepare Reference Images**
   - Visit jupiter.ag, phantom.app, linear.app
   - Take screenshots of layouts you like
   - Save to a reference folder

4. **Open Cursor/Kiro**
   - Load this entire PRD file
   - Start with "Build me the Next.js project structure with wallet provider"
   - Then: "Create the header component with wallet connection button"
   - Work through Implementation Checklist in order

### Vibe Coding Tips:

**Good Prompts:**
- "Create the task marketplace page matching the design in PRD section 5. Use glassmorphism cards with the color palette provided."
- "Build the task posting form with live cost calculator. Reference the form fields in Phase 4 checklist."
- "Implement the approve payment button. Connect to the smart contract release_payment function."

**Include in Every Prompt:**
- Reference specific PRD sections
- Mention the design style (glassmorphism, purple/cyan gradient)
- Point to database schema for data structure
- Specify responsive behavior

**Show AI Visual References:**
- Screenshot Jupiter/Phantom/Linear
- Attach to prompts: "Make the cards look like this but with our brand colors"

**Test Frequently:**
- After each major feature, test in browser
- Use Devnet for all testing
- Don't deploy to Mainnet until fully tested

### Streaming Setup:

1. **OBS Scene:**
   - Browser source: Your live site
   - Window capture: Cursor/Kiro editor
   - Webcam (optional)

2. **Talking Points:**
   - Show PRD document
   - Explain what you're building (micro-tasks + crypto)
   - Show AI generating code in real-time
   - Test features live
   - React to viewer comments

3. **Hype Moments:**
   - First wallet connection works
   - First task posted
   - First payment sent
   - Charts showing data

### Token Launch Timing:

**Launch $TASK on Pump.Fun when:**
- Landing page is live ✅
- Platform MVP works (can post task, complete, get paid)
- You have demo video ready
- You can show it live on stream

**Don't wait for:**
- Perfect design (iterate after launch)
- All features (ship MVP first)
- Bug-free code (fix as you go)

The goal: **Get something working FAST, launch token, hype it up, improve while streaming.**

---

## Questions? Issues?

**Common Problems:**

**"Wallet won't connect"**
- Check you're on Devnet
- Clear browser cache
- Make sure wallet extension is installed

**"Database query fails"**
- Check RLS policies in Supabase
- Verify table names match schema
- Look at Supabase logs

**"Transaction fails"**
- Check wallet has SOL for gas
- Verify smart contract is deployed
- Check Program ID matches deployed contract

**"AI code doesn't work"**
- Show AI the error message
- Reference specific PRD section again
- Ask "Fix this error: [paste error]"

**"Design looks off"**
- Show AI reference screenshot again
- Ask to adjust specific elements
- Iterate: "Make cards more glassy" / "Increase spacing"

---

## Final Checklist Before Launch

- [ ] All core user flows work (post → accept → submit → approve → paid)
- [ ] Site is responsive on mobile
- [ ] No critical bugs
- [ ] Smart contract deployed to Mainnet
- [ ] Custom domain working (TaskBlitz.click)
- [ ] Demo video recorded
- [ ] Screenshots of platform ready
- [ ] X account set up
- [ ] Telegram community created
- [ ] Landing page live
- [ ] Admin analytics showing data
- [ ] Pump.Fun launch plan ready

**When all checked: LAUNCH THE TOKEN! 🚀**

---

**Remember:** Perfect is the enemy of shipped. Get it working, launch it, improve it live. Degens respect builders who ship fast and iterate publicly.

Let's build this. 🔥
