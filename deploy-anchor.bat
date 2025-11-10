@echo off
echo ========================================
echo TaskBlitz - Installing Anchor
echo ========================================
echo.

echo Installing Anchor Version Manager (AVM)...
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

echo.
echo Installing latest Anchor...
avm install latest
avm use latest

echo.
echo Verifying installation...
anchor --version

echo.
echo ========================================
echo Anchor Installed!
echo ========================================
echo.
echo Next, run: deploy-devnet.bat
echo.
pause
