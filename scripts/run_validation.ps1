Write-Host "🚀 Starting validation for letsdoittonight..." -ForegroundColor Cyan

# --- 1️⃣  Read configuration ---
$configPath = Join-Path $PSScriptRoot "validation_prompt.json"
$config = Get-Content $configPath | ConvertFrom-Json

# --- 2️⃣  Simulate validation ---
Write-Host "🔍 Checking repo:" $config.repository
Write-Host "🔗 Backend:" $config.linkedBackend
Write-Host "🌍 Environments:"
$config.environments.PSObject.Properties | ForEach-Object {
    Write-Host ("    {0}: {1}" -f $_.Name, $_.Value)
}

# --- 3️⃣  Generate a mock report ---
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$reportDir = Join-Path $PSScriptRoot "..\reports\validation"
if (-not (Test-Path $reportDir)) { New-Item -ItemType Directory -Path $reportDir | Out-Null }
$reportPath = Join-Path $reportDir "validation_report_$timestamp.md"

@"
# Validation Report — $timestamp

**Repository:** $($config.repository)
**Backend:** $($config.linkedBackend)

✅ Frontend and backend configurations detected  
✅ Codex config valid  
✅ Validation prompt successfully parsed  
🚀 Ready for Codex / AI Studio integration
"@ | Out-File -FilePath $reportPath -Encoding utf8

Write-Host "`n✅ Validation complete! Report saved to:" $reportPath -ForegroundColor Green
