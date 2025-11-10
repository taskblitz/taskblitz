# 🧪 Local Testing Guide - TaskBlitz Escrow System

## ✅ **Prerequisites Checklist:**

Before testing, make sure you have:
- ✅ Dev server running: http://localhost:3002
- ✅ Phantom wallet installed (or Jupiter/Solflare)
- ✅ Wallet switched to **Devnet**
- ✅ At least 0.5 SOL in Devnet wallet

---

## 🚀 **Step-by-Step Testing:**

### **Step 1: Setup Your Wallet**

1. **Install Phantom Wallet:**
   - Go to https://phantom.app
   - Install browser extension
   - Create or import wallet

2. **Switch to Devnet:**
   - Open Phantom
   - Click Settings (gear icon)
   - Scroll to "Developer Settings"
   - Change Network to **Devnet**
   - ✅ You should see "Devnet" at the top

3. **Get Devnet SOL:**
   - Go to https://faucet.solana.com
   - Paste your wallet address
   - Request 2 SOL
   - Wait ~30 seconds
   - Check balance in Phantom

---

### **Step 2: Connect Wallet to TaskBlitz**

1. **Open TaskBlitz:**
   ```
   http://localhost:3002
   ```

2. **Click "Connect Wallet"** (top right)

3. **Select your wallet** (Phantom/Jupiter/etc.)

4. **Approve connection**

5. **✅ You should see:**
   - Your wallet address displayed
   - Your SOL balance
   - "Connected" status

---

### **Step 3: Create a Task with Escrow**

1. **Click "Post Task"** button

2. **Fill in the form:**
   ```
   Title: Test Escrow Task
   Description: Testing the escrow system
   Category: Testing
   Payment: $0.50 (small amount for testing)
   Workers Needed: 1
   Time Estimate: 5 minutes
   Submission Type: Text
   Requirements: Just write "Test complete"
   ```

3. **Click "Post Task"**

4. **Wallet will prompt:**
   ```
   Transaction Request
   TaskBlitz wants to:
   - Transfer ~0.0037 SOL (includes fee)
   
   This will lock funds in escrow!
   ```

5. **Click "Approve"**

6. **Wait for confirmation** (~2-5 seconds)

7. **✅ Success! You should see:**
   - "Task posted! Funds locked in escrow"
   - Redirected to homepage
   - Your task appears in the list

8. **Verify on Solana Explorer:**
   - Copy the transaction hash from console
   - Go to: `https://explorer.solana.com/tx/TX_HASH?cluster=devnet`
   - ✅ You should see the escrow transfer

---

### **Step 4: Submit Work (As Worker)**

**Option A: Same Wallet (Quick Test)**
1. Find your task on homepage
2. Click on the task
3. Click "Apply & Submit"
4. Fill in submission: "Test complete"
5. Click "Submit Work"
6. ✅ Submission recorded

**Option B: Different Wallet (Full Test)**
1. Open incognito/different browser
2. Connect different wallet
3. Find the task
4. Submit work
5. ✅ More realistic test

---

### **Step 5: Approve Payment (Release from Escrow)**

1. **Go to "My Tasks"** (top navigation)

2. **Find your task** in "Posted Tasks" tab

3. **Click "Review Submissions"**

4. **You should see:**
   ```
   Submission from: @YourUsername
   Status: Pending
   Submission: "Test complete"
   ```

5. **Click "Approve & Pay"**

6. **Wallet will prompt:**
   ```
   Transaction Request
   TaskBlitz wants to:
   - Approve submission
   - Release payment from escrow
   
   No additional payment needed!
   (Payment comes from escrow)
   ```

7. **Click "Approve"**

8. **Wait for confirmation** (~2-5 seconds)

9. **✅ Success! You should see:**
   - "Approved! Payment released from escrow"
   - Submission status: Approved
   - Task status: Completed

---

### **Step 6: Verify Everything Worked**

#### **Check Your Wallet:**
```
Before creating task: X SOL
After creating task: X - 0.0037 SOL (locked in escrow)
After approving: Same (payment came from escrow)
```

#### **Check Worker Wallet:**
```
Before: Y SOL
After approval: Y + 0.0033 SOL (received payment)
```

#### **Check on Solana Explorer:**

1. **Task Creation Transaction:**
   ```
   https://explorer.solana.com/tx/CREATE_TX_HASH?cluster=devnet
   
   Should show:
   - Transfer to escrow PDA
   - Amount: ~0.0037 SOL
   - Status: Success ✅
   ```

2. **Approval Transaction:**
   ```
   https://explorer.solana.com/tx/APPROVE_TX_HASH?cluster=devnet
   
   Should show:
   - Transfer from escrow to worker
   - Amount: ~0.0033 SOL
   - Platform fee: ~0.0003 SOL
   - Status: Success ✅
   ```

3. **Check Escrow Account:**
   ```
   Find escrow PDA address in console logs
   https://explorer.solana.com/address/ESCROW_PDA?cluster=devnet
   
   Should show:
   - Balance: 0 SOL (empty after payment)
   - Owner: Your program
   ```

---

## 🎯 **What to Test:**

### **Basic Flow (Must Test):**
- ✅ Create task with escrow
- ✅ Submit work
- ✅ Approve and release payment
- ✅ Verify balances changed correctly

### **Edge Cases (Optional):**
- ✅ Create task with multiple workers
- ✅ Reject a submission
- ✅ Cancel a task (refund)
- ✅ Try to approve without being requester
- ✅ Try to submit twice for same task

---

## 🐛 **Troubleshooting:**

### **"Wallet not connected"**
- Make sure wallet is on Devnet
- Refresh page and reconnect
- Check browser console for errors

### **"Insufficient funds"**
- Get more Devnet SOL from faucet
- Try smaller payment amount
- Check you have at least 0.1 SOL

### **"Transaction failed"**
- Check Devnet is not congested
- Try again in a few seconds
- Check console for error details
- Verify program ID is correct

### **"Program error"**
- Make sure smart contract is deployed
- Verify program ID in .env.local
- Check Solana Explorer for program

### **Escrow not working**
- Check console logs for errors
- Verify Anchor client is loaded
- Check network is Devnet
- Try refreshing the page

---

## 📊 **Expected Results:**

### **Console Logs (Check Browser DevTools):**

**Creating Task:**
```javascript
Creating task with escrow: {
  taskId: "uuid-here",
  taskPDA: "PublicKey...",
  escrowPDA: "PublicKey...",
  paymentLamports: 3333333,
  workersNeeded: 1
}
✅ Task created with escrow! TX: signature...
```

**Approving Submission:**
```javascript
Approving submission with escrow release: {
  taskPDA: "PublicKey...",
  submissionPDA: "PublicKey...",
  escrowPDA: "PublicKey...",
  worker: "PublicKey..."
}
✅ Submission approved! Payment released from escrow. TX: signature...
```

---

## ✅ **Success Criteria:**

You've successfully tested the escrow system if:

1. ✅ Task created and funds locked
2. ✅ Escrow PDA has balance on Solana Explorer
3. ✅ Work submitted successfully
4. ✅ Payment released from escrow (not your wallet)
5. ✅ Worker received correct amount
6. ✅ Platform fee deducted (10%)
7. ✅ Escrow balance is 0 after payment
8. ✅ All transactions visible on Solana Explorer

---

## 🎉 **You're Done!**

If all steps worked, congratulations! You have a fully functional escrow system.

**Next Steps:**
- Test with multiple workers
- Test cancellation and refunds
- Test rejection flow
- Deploy to Vercel
- Share with beta testers

---

## 📝 **Testing Checklist:**

```
□ Wallet connected to Devnet
□ Got Devnet SOL from faucet
□ Created task successfully
□ Funds locked in escrow
□ Verified on Solana Explorer
□ Submitted work
□ Approved submission
□ Payment released from escrow
□ Worker received payment
□ Platform fee collected
□ Escrow balance is 0
□ All transactions confirmed
```

---

**Happy Testing!** 🚀

If you encounter any issues, check the console logs and Solana Explorer for details.
