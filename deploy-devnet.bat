@echo off
echo ========================================
echo TaskBlitz - Deploy to Devnet
echo ========================================
echo.

echo Step 1: Configure Solana for Devnet...
solana config set --url https://api.devnet.solana.com

echo.
echo Step 2: Check if wallet exists...
if not exist "%USERPROFILE%\.config\solana\id.json" (
    echo Creating new wallet...
    solana-keygen new --outfile %USERPROFILE%\.config\solana\id.json
) else (
    echo Wallet already exists.
)

echo.
echo Step 3: Get your wallet address...
solana address

echo.
echo Step 4: Airdrop Devnet SOL...
echo Requesting 2 SOL...
solana airdrop 2
timeout /t 3 /nobreak >nul
echo Checking balance...
solana balance

echo.
echo Step 5: Building smart contract...
anchor build

echo.
echo Step 6: Deploying to Devnet...
anchor deploy

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Your Program ID will be shown above.
echo Copy it and update your .env.local file:
echo   NEXT_PUBLIC_PROGRAM_ID=YourProgramIdHere
echo.
pause
