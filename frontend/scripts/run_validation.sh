#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API_URL="${VITE_API_URL:-${1:-http://localhost:4000}}"

printf '🧠 Preparing frontend workspace at %s\n' "$PROJECT_DIR"
cd "$PROJECT_DIR"

if [[ -f package-lock.json ]]; then
  npm ci --silent
else
  npm install --silent
fi

printf '🏗️ Building frontend...\n'
npm run build

printf '🔍 Checking backend health at %s/api/health...\n' "$API_URL"
if curl --silent --fail --max-time 10 "$API_URL/api/health" >/dev/null; then
  printf '✅ Backend responded successfully.\n'
else
  printf '⚠️ Backend did not respond.\n'
fi

printf '✅ Validation complete.\n'
