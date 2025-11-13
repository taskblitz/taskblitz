# Dual Currency Support: SOL + USDC

## Current Setup

### 1. Payment Currencies
- **SOL (Primary)** - For Devnet testing with live price API
- **USDC (Secondary)** - Stablecoin option with 1:1 USD parity
- Users can choose which currency to use when posting tasks

### 2. SOL Price API (CoinGecko - Free)
- `lib/solana-price.ts`: Real-time SOL/USD price fetching
- Updates every 60 seconds (cached)
- Fallback to $150 if API fails
- No API key required for CoinGecko free tier

### 3. Code Updates
- `lib/anchor-client.ts`: Supports both SOL and USDC
- `lib/solana.ts`: Added live price conversion functions
- `lib/database.ts`: Currency type supports both
- `components/PostTaskForm.tsx`: Currency selector with both options

### 4. How It Works
**SOL Payments:**
- Fetches live SOL/USD rate from CoinGecko
- Converts USD amount to SOL automatically
- Shows "Live SOL/USD rate" in UI
- Perfect for Devnet testing

**USDC Payments:**
- 1:1 with USD (no conversion needed)
- Stablecoin - no volatility
- Shows "1:1 with USD" in UI
- Better for mainnet production

### 5. Database Schema
Both currencies supported:
```sql
currency TEXT DEFAULT 'SOL' CHECK (currency IN ('SOL', 'USDC'))
```

### 6. Benefits
✅ **SOL**: Easy Devnet testing, no USDC setup needed
✅ **USDC**: Stable pricing, no exchange rate risk
✅ **Live Pricing**: Real-time SOL/USD rates
✅ **User Choice**: Let users pick their preferred currency
✅ **Fallback**: Works even if price API fails

### 7. For Mainnet Launch
When moving to mainnet:
- Consider making USDC the default
- Keep SOL as an option
- Or hide SOL option entirely (easy config change)

## Testing Checklist
- [ ] Test task creation with SOL (Devnet)
- [ ] Test task creation with USDC
- [ ] Verify live SOL price updates
- [ ] Test worker payments in both currencies
- [ ] Check transaction history shows correct currency
- [ ] Verify price fallback works if API fails
