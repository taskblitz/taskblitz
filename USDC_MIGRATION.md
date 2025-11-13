# USDC Migration Complete

## Changes Made

### 1. Payment Currency
- **Switched from SOL to USDC** as the primary payment currency
- USDC provides 1:1 parity with USD (no exchange rate fluctuations)
- SOL support temporarily removed (can be re-added later with price oracle)

### 2. Code Updates
- `lib/anchor-client.ts`: Updated default currency to USDC
- `lib/database.ts`: Updated currency type to USDC only
- `components/PostTaskForm.tsx`: Removed currency selector, hardcoded to USDC
- `components/USDCInfo.tsx`: New component showing USDC payment info

### 3. Database Changes
- `supabase-add-currency.sql`: Updated default to USDC
- `supabase-setup.sql`: Updated transactions table default to USDC
- `supabase-migrate-to-usdc.sql`: Migration script to update existing data

### 4. SQL Migration Required
Run this in Supabase SQL Editor:
```sql
-- Update existing tasks and transactions to USDC
UPDATE tasks SET currency = 'USDC' WHERE currency = 'SOL' OR currency IS NULL;
UPDATE transactions SET currency = 'USDC' WHERE currency = 'SOL' OR currency IS NULL;

-- Update constraints
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_currency_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_currency_check CHECK (currency IN ('USDC'));

ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_currency_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_currency_check CHECK (currency IN ('USDC'));

-- Set defaults
ALTER TABLE tasks ALTER COLUMN currency SET DEFAULT 'USDC';
ALTER TABLE transactions ALTER COLUMN currency SET DEFAULT 'USDC';
```

### 5. USDC Setup on Devnet
Users need USDC in their wallets. For testing on Devnet:
1. Get Devnet SOL from faucet
2. Swap for Devnet USDC or use USDC faucet
3. USDC Devnet Mint: `Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr`

### 6. Benefits
✅ No exchange rate volatility
✅ True 1:1 USD pricing
✅ Easier accounting and reporting
✅ More predictable for users
✅ Standard in DeFi/Web3

### 7. Future: Adding SOL Back
When ready to support SOL:
1. Integrate price oracle (Pyth, Switchboard, or Chainlink)
2. Add real-time SOL/USD conversion
3. Update UI to show both currencies
4. Let users choose payment method

## Testing Checklist
- [ ] Run SQL migration in Supabase
- [ ] Test task creation with USDC
- [ ] Test worker payments in USDC
- [ ] Verify transaction history shows USDC
- [ ] Check admin dashboard displays USDC correctly
- [ ] Test on Devnet before mainnet
