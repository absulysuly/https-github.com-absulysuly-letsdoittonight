Write-Host "🚀 Optimizing & Deploying Hamlet Unified..." -ForegroundColor Cyan

npm ci
npm run build:css
npm run build

Write-Host "🔍 Running Lighthouse Audit..." -ForegroundColor Yellow
npx lhci autorun --upload.target=filesystem --upload.outputDir=.lighthouseci

Write-Host "🌐 Verifying backend health..." -ForegroundColor Cyan
curl -I https://hamlet-unified-complete-2027-production.up.railway.app/api/health
curl -I https://hamlet-unified-complete-2027-production.up.railway.app/api/candidates

Write-Host "✅ Completed. Check .lighthouseci/ for scores." -ForegroundColor Green
