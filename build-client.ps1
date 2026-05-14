# build-client.ps1

Write-Host "=== Step 1: Building React Frontend ===" -ForegroundColor Cyan
Set-Location frontend
npm install
npm run build
Set-Location ..

Write-Host "=== Step 2: Packaging with Electron ===" -ForegroundColor Cyan
Set-Location electron-wrapper
npm install
npm run build
Set-Location ..

Write-Host "=== Done! Installer is in electron-wrapper/dist/ ===" -ForegroundColor Green
