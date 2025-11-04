@echo off
echo Setting up TaskBlitz development environment...

REM Install Python if not present
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Python...
    winget install Python.Python.3.12
    echo Please restart your terminal and run this script again.
    pause
    exit /b
)

REM Install uv package manager
echo Installing uv package manager...
pip install uv

REM Test MCP servers
echo Testing MCP servers...
uvx mcp-server-fetch --help
uvx mcp-server-filesystem --help  
uvx mcp-server-git --help

echo Setup complete! You can now update your MCP configuration.
pause