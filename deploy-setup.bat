@echo off
echo ========================================
echo TaskBlitz - Solana Deployment Setup
echo ========================================
echo.

echo Step 1: Installing Rust and Cargo...
echo Downloading Rust installer...
curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs -o rustup-init.exe
if exist rustup-init.exe (
    echo Running Rust installer...
    rustup-init.exe -y
    del rustup-init.exe
    echo Rust installed! Please restart your terminal.
) else (
    echo Failed to download Rust installer.
    exit /b 1
)

echo.
echo Step 2: Installing Solana CLI...
echo Downloading Solana installer...
mkdir C:\solana-install-tmp 2>nul
curl https://release.solana.com/v1.18.18/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe
if exist C:\solana-install-tmp\solana-install-init.exe (
    echo Running Solana installer...
    C:\solana-install-tmp\solana-install-init.exe v1.18.18
    echo Solana installed!
) else (
    echo Failed to download Solana installer.
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo IMPORTANT: Close this terminal and open a NEW one, then run:
echo   deploy-anchor.bat
echo.
pause
