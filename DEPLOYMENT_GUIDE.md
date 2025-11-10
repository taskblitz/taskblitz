# 🚀 TaskBlitz Deployment Guide

## Quick Start - 3 Simple Steps

### Step 1: Install Tools
Run this in PowerShell **as Administrator**:
```powershell
.\deploy-setup.bat
```
This installs:
- Rust and Cargo
- Solana CLI

**After this completes, CLOSE and REOPEN your terminal!**

---

### Step 2: Install Anchor
In a NEW terminal, run:
```powershell
.\deploy-anchor.bat
```
This installs the Anchor framework for Solana smart contracts.

---

### Step 3: Deploy to Devnet
```powershell
.\deploy-devnet.bat
```
This will:
- Configure Solana for Devnet
- Create a wallet (if needed)
- Airdrop test SOL
- Build your smart contract
- Deploy to Devnet
- Show your Program ID

---

## After Deployment

### 1. Copy Your Program ID
After deployment, you'll see something like:
```
Program Id: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

### 2. Update Your Frontend
Add to `.env.local`:
```env
NEXT_PUBLIC_PROGRAM_ID=YourProgramIdHere
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

### 3. Update lib/solana.ts
The program ID is already configured to read from env variables, so you're good!

### 4. Test Your Deployment
```powershell
# Check your program exists
solana program show YourProgramIdHere --url devnet

# Check your wallet balance
solana balance
```

---

## Troubleshooting

### "Command not found" after installation
- Close and reopen your terminal
- Restart VS Code if using integrated terminal

### Airdrop fails
- Devnet can be rate-limited
- Wait a few minutes and try again
- Or use: https://faucet.solana.com

### Build fails
- Make sure you're in the project root directory
- Check that `programs/taskblitz/` exists
- Run `anchor build --verbose` for details

### Deployment fails - "Insufficient funds"
- Run `solana airdrop 2` again
- Check balance: `solana balance`

---

## Manual Installation (If Scripts Fail)

### Install Rust
```powershell
# Download and run
curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs -o rustup-init.exe
.\rustup-init.exe
```

### Install Solana
```powershell
# Download installer
curl https://release.solana.com/v1.18.18/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs

# Run installer
C:\solana-install-tmp\solana-install-init.exe v1.18.18
```

### Install Anchor
```powershell
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

---

## Next Steps After Deployment

1. ✅ Update `.env.local` with Program ID
2. ✅ Test wallet connection on frontend
3. ✅ Create a test task with real SOL
4. ✅ Test complete payment flow
5. ✅ Verify escrow works correctly

---

## Need Help?

- Solana Docs: https://docs.solana.com
- Anchor Docs: https://www.anchor-lang.com
- Solana Discord: https://discord.gg/solana
- Devnet Faucet: https://faucet.solana.com

Good luck! 🎯
