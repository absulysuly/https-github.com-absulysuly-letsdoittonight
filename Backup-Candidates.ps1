<#
.SYNOPSIS
    Backs up the latest candidates cache file after each git push.
.DESCRIPTION
    Copies backend\data\candidates_cache.json to E:\HamletUnified\backups\ with timestamp.
#>

$SourcePath = "E:\HamletUnified\hamlet-unified-complete-2027\backend\data\candidates_cache.json"
$BackupDir  = "E:\HamletUnified\backups"
$Timestamp  = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = Join-Path $BackupDir "candidates_cache_$Timestamp.json"

# Ensure backup directory exists
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
    Write-Host "📁 Created backup directory at $BackupDir"
}

# Copy cache file if it exists
if (Test-Path $SourcePath) {
    Copy-Item -Path $SourcePath -Destination $BackupFile -Force
    Write-Host "✅ Candidate cache backed up to $BackupFile"
}
else {
    Write-Host "⚠️ No cache file found at $SourcePath"
}

# Optional: prune old backups (keep last 10)
$Backups = Get-ChildItem -Path $BackupDir -Filter "candidates_cache_*.json" | Sort-Object LastWriteTime -Descending
if ($Backups.Count -gt 10) {
    $OldBackups = $Backups | Select-Object -Skip 10
    $OldBackups | Remove-Item -Force
    Write-Host "🧹 Pruned $($OldBackups.Count) old backups."
}
