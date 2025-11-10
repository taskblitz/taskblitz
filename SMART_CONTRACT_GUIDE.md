# TaskBlitz Smart Contract Guide

## Overview
TaskBlitz uses Solana smart contracts (programs) built with Anchor framework to handle:
- Escrow management for task payments
- Automatic payment distribution on approval
- Platform fee collection (10%)
- Dispute resolution

## Architecture

### Program Accounts
1. **Task Account** - Stores task metadata and escrow info
2. **Submission Account** - Tracks worker submissions
3. **Escrow PDA** - Holds funds until work is approved

### Key Functions
- `create_task` - Creates task and locks funds in escrow
- `submit_work` - Worker submits completed work
- `approve_submission` - Releases payment to worker
- `reject_submission` - Marks submission as rejected
- `cancel_task` - Refunds remaining escrow to requester

## Setup Instructions

### Prerequisites
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### Build & Deploy

```bash
# Build the program
anchor build

# Get program ID
solana address -k target/deploy/taskblitz-keypair.json

# Update Anchor.toml and lib.rs with program ID

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Run tests
anchor test
```

## Integration with Frontend

### 1. Update Program ID
After deployment, update `lib/solana.ts`:
```typescript
export const PROGRAM_ID = new PublicKey('YOUR_DEPLOYED_PROGRAM_ID')
```

### 2. Update Platform Wallet
Set your platform wallet address:
```typescript
export const PLATFORM_WALLET = new PublicKey('YOUR_PLATFORM_WALLET')
```

### 3. Test on Devnet
- Use devnet SOL (get from faucet)
- Test complete flow: create → submit → approve
- Verify payments work correctly

## Payment Flow

### Creating a Task
1. User specifies payment per worker (in USD)
2. Frontend converts USD to SOL
3. Smart contract calculates total escrow (payment + 10% fee)
4. SOL is transferred to escrow PDA
5. Task account is created on-chain

### Approving Work
1. Requester approves submission
2. Smart contract transfers payment to worker
3. Platform fee (10%) goes to platform wallet
4. Submission marked as approved
5. Task progress updated

### Canceling a Task
1. Requester cancels task
2. Smart contract calculates refund (escrow - completed payments)
3. Remaining SOL returned to requester
4. Task marked as cancelled

## Security Features

- **Escrow Protection**: Funds locked until work approved
- **PDA Accounts**: Secure, deterministic addresses
- **Authorization Checks**: Only requester can approve/cancel
- **Overflow Protection**: Safe math operations
- **Status Validation**: Prevents invalid state transitions

## Testing Checklist

- [ ] Create task with escrow
- [ ] Submit work as worker
- [ ] Approve submission (verify payment)
- [ ] Reject submission (verify no payment)
- [ ] Cancel task (verify refund)
- [ ] Test with multiple workers
- [ ] Test task completion (all spots filled)
- [ ] Verify platform fees collected

## Production Deployment

### Mainnet Checklist
- [ ] Audit smart contract code
- [ ] Test extensively on devnet
- [ ] Use real SOL price oracle
- [ ] Set up monitoring
- [ ] Deploy to mainnet
- [ ] Update frontend configuration
- [ ] Test with small amounts first

## Troubleshooting

### Common Issues
1. **Transaction fails**: Check wallet has enough SOL for rent + payment
2. **PDA derivation error**: Verify seeds match between program and frontend
3. **Unauthorized error**: Ensure correct signer
4. **Overflow error**: Check payment amounts are reasonable

### Useful Commands
```bash
# Check program logs
solana logs PROGRAM_ID

# Get account info
solana account ACCOUNT_ADDRESS

# Check balance
solana balance WALLET_ADDRESS

# Airdrop devnet SOL
solana airdrop 2 WALLET_ADDRESS --url devnet
```

## Next Steps

1. **Deploy to Devnet**: Test the program thoroughly
2. **Integrate Frontend**: Connect UI to smart contract functions
3. **Add Error Handling**: Handle transaction failures gracefully
4. **Test Payment Flow**: Verify end-to-end with real transactions
5. **Audit & Security**: Review before mainnet deployment

## Resources

- Anchor Docs: https://www.anchor-lang.com/
- Solana Cookbook: https://solanacookbook.com/
- Solana Web3.js: https://solana-labs.github.io/solana-web3.js/