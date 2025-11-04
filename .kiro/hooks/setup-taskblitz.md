# TaskBlitz Auto-Setup Hook

## Hook Configuration
```yaml
name: "Setup TaskBlitz Development Environment"
trigger: manual
description: "Automatically sets up the complete TaskBlitz development environment"
```

## What This Hook Does
1. Installs Python and uv package manager
2. Sets up MCP servers for enhanced development
3. Initializes Next.js project with all dependencies
4. Configures Supabase and Solana development environment
5. Creates the complete project structure

## Instructions for User
1. Open Kiro Command Palette (Ctrl+Shift+P)
2. Search for "Open Kiro Hook UI"
3. Click "Create New Hook"
4. Use this file as the template
5. Click "Run Hook" to execute automatic setup

## Alternative: Skip MCP Setup
If you want to start building immediately without MCP configuration, just say:
"Skip MCP setup and start building TaskBlitz with basic Kiro tools"

I can build the entire project using Kiro's built-in file operations - it'll work perfectly fine, just slightly slower for bulk operations.