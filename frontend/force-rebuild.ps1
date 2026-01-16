# Force complete cache clear and rebuild

Write-Host "=== Force Clean Rebuild ===" -ForegroundColor Cyan

# 1. Kill all Node processes
Write-Host "Stopping all Node processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 2. Delete all build/cache directories
Write-Host "Deleting build caches..." -ForegroundColor Yellow
Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "node_modules/.cache" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".turbo" -ErrorAction SilentlyContinue

# 3. Start fresh dev server
Write-Host "Starting clean dev server..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "npm run dev" -WorkingDirectory (Get-Location)

Start-Sleep -Seconds 8

# 4. Verify server is up
Write-Host "Verifying server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8888" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "Server is running" -ForegroundColor Green
    }
}
catch {
    Write-Host "Server not ready yet, give it a few more seconds" -ForegroundColor Yellow
}

Write-Host "`n=== INSTRUCTIONS ===" -ForegroundColor Cyan
Write-Host "1. Hard refresh your browser (Ctrl+Shift+R)" -ForegroundColor Yellow
Write-Host "2. Or clear browser cache" -ForegroundColor Yellow
Write-Host "3. Or open in Incognito/Private window" -ForegroundColor Yellow
Write-Host "`nServer running at: http://localhost:8888" -ForegroundColor Green
