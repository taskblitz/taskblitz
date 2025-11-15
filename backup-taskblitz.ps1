# TaskBlitz Backup Script (Windows PowerShell)
# This creates a clean backup without node_modules and build files

$backupName = "TaskBlitz-Backup-$(Get-Date -Format 'yyyy-MM-dd-HHmm')"
$backupPath = "$env:USERPROFILE\Desktop\$backupName"

Write-Host "Creating TaskBlitz backup..." -ForegroundColor Cyan
Write-Host "Backup location: $backupPath" -ForegroundColor Yellow

# Create backup directory
New-Item -ItemType Directory -Path $backupPath -Force | Out-Null

# Copy essential folders
Write-Host "`nCopying source code folders..." -ForegroundColor Green
$folders = @('app', 'components', 'lib', 'types', 'public', 'programs')
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Host "  - Copying /$folder"
        Copy-Item -Path $folder -Destination $backupPath -Recurse -Force
    }
}

# Copy root configuration files
Write-Host "`nCopying configuration files..." -ForegroundColor Green
$configFiles = @(
    'package.json',
    'package-lock.json',
    'next.config.js',
    'tsconfig.json',
    'tailwind.config.ts',
    'postcss.config.js',
    '.env.local',
    '.gitignore'
)
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "  - Copying $file"
        Copy-Item -Path $file -Destination $backupPath -Force
    }
}

# Copy all documentation and SQL files
Write-Host "`nCopying documentation..." -ForegroundColor Green
Get-ChildItem -Path . -Filter "*.md" -File | ForEach-Object {
    Write-Host "  - Copying $($_.Name)"
    Copy-Item -Path $_.FullName -Destination $backupPath -Force
}

Get-ChildItem -Path . -Filter "*.sql" -File | ForEach-Object {
    Write-Host "  - Copying $($_.Name)"
    Copy-Item -Path $_.FullName -Destination $backupPath -Force
}

# Copy x402-sdk-repo if exists
if (Test-Path "x402-sdk-repo") {
    Write-Host "`nCopying x402-sdk-repo..." -ForegroundColor Green
    Copy-Item -Path "x402-sdk-repo" -Destination $backupPath -Recurse -Force
}

# Create backup info file
$backupInfo = @"
TaskBlitz Backup
Created: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Source: $(Get-Location)

This backup contains:
- All source code (app, components, lib, types)
- Configuration files
- Documentation (.md files)
- SQL scripts
- Environment variables (.env.local)

To restore:
1. Extract this folder
2. Run: npm install
3. Copy .env.local and update if needed
4. Run: npm run dev

Dependencies excluded (reinstall with npm install):
- node_modules (can be huge, 200MB+)
- .next build folder
- .vercel deployment cache
"@

$backupInfo | Out-File -FilePath "$backupPath\BACKUP_INFO.txt" -Encoding UTF8

# Calculate backup size
$backupSize = (Get-ChildItem -Path $backupPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB

Write-Host "`n✅ Backup complete!" -ForegroundColor Green
Write-Host "Location: $backupPath" -ForegroundColor Cyan
Write-Host "Size: $([math]::Round($backupSize, 2)) MB" -ForegroundColor Cyan
Write-Host "`nYou can now compress this folder and store it safely." -ForegroundColor Yellow

# Ask if user wants to open backup folder
$response = Read-Host "`nOpen backup folder? (Y/N)"
if ($response -eq 'Y' -or $response -eq 'y') {
    explorer $backupPath
}
