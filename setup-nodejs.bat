@echo off
echo ========================================
echo TaskBlitz Setup - Installing Node.js
echo ========================================

REM Check if Node.js is already installed
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Node.js is already installed!
    node --version
    npm --version
    goto :install_deps
)

echo Installing Node.js...
echo.
echo Please choose an installation method:
echo 1. Download and install manually (recommended)
echo 2. Install via winget (if available)
echo.
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo Opening Node.js download page...
    start https://nodejs.org/en/download/
    echo.
    echo Please:
    echo 1. Download the Windows Installer (.msi)
    echo 2. Run the installer
    echo 3. Restart this terminal
    echo 4. Run this script again
    pause
    exit /b
)

if "%choice%"=="2" (
    echo Installing Node.js via winget...
    winget install OpenJS.NodeJS
    if %errorlevel% neq 0 (
        echo Winget installation failed. Please use option 1.
        pause
        exit /b
    )
)

:install_deps
echo.
echo ========================================
echo Installing TaskBlitz Dependencies
echo ========================================

REM Install dependencies
echo Installing project dependencies...
npm install

if %errorlevel% neq 0 (
    echo.
    echo Error installing dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy .env.local.example to .env.local
echo 2. Add your Supabase credentials
echo 3. Run: npm run dev
echo 4. Open: http://localhost:3000
echo.
echo Happy coding! 🚀
pause