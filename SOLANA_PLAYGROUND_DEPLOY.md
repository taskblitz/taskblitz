# 🚀 Deploy TaskBlitz to Devnet (Solana Playground)

## No Installation Required - Deploy in 5 Minutes!

### Step 1: Open Solana Playground
Go to: **https://beta.solpg.io**

---

### Step 2: Create New Anchor Project
1. Click "Create a new project"
2. Select "Anchor (Rust)"
3. Name it: `taskblitz`

---

### Step 3: Replace the Code

#### File 1: `src/lib.rs`
Delete everything and paste the code from: `programs/taskblitz/src/lib.rs`

(The entire Rust smart contract - I'll show you the exact code below)

#### File 2: `Cargo.toml`
Replace the dependencies section with:
```toml
[dependencies]
anchor-lang = "0.29.0"
anchor-spl = "0.29.0"
```

---

### Step 4: Connect Wallet
1. Click "Connect" in the top right
2. It will create a Playground wallet for you automatically
3. Click "Airdrop" to get 5 SOL on Devnet

---

### Step 5: Build
1. Click the "Build" button (hammer icon)
2. Wait ~30 seconds for compilation
3. You should see "Build successful ✓"

---

### Step 6: Deploy
1. Click the "Deploy" button (rocket icon)
2. Wait ~10 seconds
3. You'll see: **"Deployment successful!"**
4. **COPY THE PROGRAM ID** - it looks like:
   ```
   Program Id: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
   ```

---

### Step 7: Update Your Frontend

Add to your `.env.local` file:
```env
NEXT_PUBLIC_PROGRAM_ID=YourProgramIdFromStep6
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

---

## ✅ That's It!

Your smart contract is now live on Solana Devnet!

### Verify Deployment
You can check your program at:
```
https://explorer.solana.com/address/YourProgramId?cluster=devnet
```

---

## Next Steps

1. ✅ Update `.env.local` with Program ID
2. ✅ Restart your Next.js dev server
3. ✅ Test wallet connection
4. ✅ Create a test task
5. ✅ Test the complete payment flow

---

## Need the Playground Wallet Later?

The playground saves your wallet. To export it:
1. Click your wallet address in Solana Playground
2. Click "Export Private Key"
3. Save it securely

You can import this into Phantom or other wallets if needed.

---

## Troubleshooting

**Build fails?**
- Make sure you copied the ENTIRE `lib.rs` file
- Check that Cargo.toml has the correct dependencies

**Deploy fails?**
- Click "Airdrop" again to get more SOL
- Make sure you're connected to Devnet (not Mainnet)

**Can't find Program ID?**
- Look in the terminal output after deployment
- Or check the "Deploy" tab

---

Good luck! This is way easier than local installation. 🎯
