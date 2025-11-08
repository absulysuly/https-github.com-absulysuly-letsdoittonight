<#!
🔥 UNIVERSAL AUTO-DEPLOY EXECUTOR
Detects project path, ensures environment readiness, validates API, and deploys to Vercel or Cloudflare automatically.
#!>

param(
  [ValidateSet('Vercel', 'Cloudflare')]
  [string]$Target = 'Vercel'
)

Write-Host "🧠 Initializing environment..."

try {
  npm install -g vercel wrangler | Out-Null
} catch {
  Write-Warning "Failed to install global CLI dependencies: $($_.Exception.Message)"
}

# Detect npm global path and ensure it is on PATH
$npmGlobalBin = Join-Path (npm prefix -g) 'node_modules/.bin'
if (-not ($env:Path -split ';' | Where-Object { $_ -eq $npmGlobalBin })) {
  $env:Path += ";$npmGlobalBin"
  [Environment]::SetEnvironmentVariable('Path', $env:Path, 'User')
}

# Also ensure Windows-specific AppData path is added
$windowsGlobal = Join-Path ([System.Environment]::GetFolderPath('LocalApplicationData')) 'npm'
if (-not [string]::IsNullOrWhiteSpace($windowsGlobal) -and -not ($env:Path -split ';' | Where-Object { $_ -eq $windowsGlobal })) {
  $env:Path += ";$windowsGlobal"
  [Environment]::SetEnvironmentVariable('Path', $env:Path, 'User')
}

# Verify CLIs are available
try { wrangler --version | Out-Null } catch { Write-Warning "wrangler CLI not detected after installation." }
try { vercel --version | Out-Null } catch { Write-Warning "vercel CLI not detected after installation." }

# Detect project path dynamically
$searchRoot = 'E:\HamletUnified'
$projectPath = Get-ChildItem $searchRoot -Recurse -Directory -ErrorAction SilentlyContinue |
  Where-Object { Test-Path (Join-Path $_.FullName 'package.json') } |
  Select-Object -First 1 -ExpandProperty FullName

if (-not $projectPath) {
  Write-Error "❌ No project found under $searchRoot"
  exit 1
}

Set-Location $projectPath

# Ensure env file exists
$envFilePath = Join-Path $projectPath '.env.production'
if (-not (Test-Path $envFilePath)) {
  @"
VITE_API_BASE_URL=https://hamlet-unified-complete-2027-production.up.railway.app
VITE_USE_MOCKS=false
VITE_APP_ENV=production
VITE_ENABLE_AI_ASSIST=true
VITE_ENABLE_REALTIME_UPDATES=true
VITE_LOG_LEVEL=info
"@ | Out-File $envFilePath -Encoding utf8
}

Write-Host "🏗️ Building project..."

if (Test-Path 'package-lock.json') {
  npm ci --quiet
} else {
  npm install --quiet
}

if ($LASTEXITCODE -ne 0) {
  Write-Error '❌ npm install failed'
  exit 1
}

npm run build
if ($LASTEXITCODE -ne 0 -or -not (Test-Path '.next' -or Test-Path 'dist')) {
  Write-Error '❌ Build failed'
  exit 1
}

Write-Host "🔍 Validating backend..."
$backendHealthy = $false
try {
  $api = Invoke-RestMethod 'https://hamlet-unified-complete-2027-production.up.railway.app/health' -TimeoutSec 10
  $backendHealthy = $true
  Write-Host "✅ Backend OK: $($api.status)"
} catch {
  Write-Warning "⚠️ Backend unreachable: $($_.Exception.Message)"
}

if ($Target -eq 'Vercel') {
  vercel deploy --prebuilt --prod --yes --confirm
} else {
  if (-not (Test-Path 'out')) {
    npm run export
    if ($LASTEXITCODE -ne 0) {
      Write-Error '❌ next export failed for Cloudflare deployment'
      exit 1
    }
  }

  $cloudflareDir = if (Test-Path 'dist') { 'dist' } elseif (Test-Path 'out') { 'out' } else { '.next' }
  wrangler pages deploy $cloudflareDir --project-name 'digital-democracy-iraq'
}

$deploymentExitCode = $LASTEXITCODE

if ($deploymentExitCode -ne 0) {
  Write-Error "❌ Deployment failed"
  exit 1
}

Write-Host "🧪 Running API validation checks..."
$validationOutput = npm run validate 2>&1
$validationExitCode = $LASTEXITCODE
($validationOutput -split "`n") | ForEach-Object { Write-Host $_ }
if ($validationExitCode -ne 0) {
  Write-Warning 'Validation script reported issues with the backend API.'
}

Write-Host "🧾 Logging validation report..."
$timestamp = Get-Date -Format 'yyyyMMdd_HHmm'
$reportDir = Join-Path $projectPath 'reports/validation'
if (-not (Test-Path $reportDir)) {
  New-Item -ItemType Directory -Path $reportDir | Out-Null
}

$reportPath = Join-Path $reportDir "report-$timestamp.txt"
$deploymentStatus = if ($deploymentExitCode -eq 0 -and $validationExitCode -eq 0) { 'successful' } else { 'completed with warnings' }
$backendStatus = if ($backendHealthy) { '✅' } else { '⚠️' }
$validationStatus = if ($validationExitCode -eq 0) { '✅' } else { '⚠️' }

@"
Deployment $deploymentStatus at $timestamp for $Target
Backend health: $backendStatus
API validation: $validationStatus

$validationOutput
"@ | Out-File $reportPath -Encoding utf8

Write-Host "🌈 COMPLETE — Everything synced & deployed!"
