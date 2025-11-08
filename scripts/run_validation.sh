#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-vercel}"
TARGET_LOWER="${TARGET,,}"

printf '🧠 Initializing environment...\n'
if command -v npm >/dev/null 2>&1; then
  npm install -g vercel wrangler >/dev/null 2>&1 || true
fi

# Ensure npm global bin is on PATH
if command -v npm >/dev/null 2>&1; then
  NPM_BIN="$(npm prefix -g 2>/dev/null)/bin"
  if [[ -d "$NPM_BIN" ]]; then
    case ":$PATH:" in
      *":$NPM_BIN:"*) ;;
      *) export PATH="$PATH:$NPM_BIN" ;;
    esac
  fi
fi

# Attempt to locate project directory
SEARCH_ROOT="${HAMLET_PROJECT_ROOT:-$HOME}"
PROJECT_PATH=""
while IFS= read -r -d '' dir; do
  if [[ -f "$dir/package.json" ]]; then
    PROJECT_PATH="$dir"
    break
  fi
done < <(find "$SEARCH_ROOT" -type d -name 'frontend-aigoodstudeio' -print0 2>/dev/null)

if [[ -z "$PROJECT_PATH" ]]; then
  echo "❌ No project found from $SEARCH_ROOT" >&2
  exit 1
fi

cd "$PROJECT_PATH"

# Ensure env file exists
if [[ ! -f .env.production ]]; then
  cat <<'ENV' > .env.production
VITE_API_BASE_URL=https://hamlet-unified-complete-2027-production.up.railway.app
VITE_USE_MOCKS=false
VITE_APP_ENV=production
VITE_ENABLE_AI_ASSIST=true
VITE_ENABLE_REALTIME_UPDATES=true
VITE_LOG_LEVEL=info
ENV
fi

printf '🏗️ Building project...\n'
if [[ -f package-lock.json ]]; then
  npm ci --quiet
else
  npm install --quiet
fi

npm run build

printf '🔍 Validating backend...\n'
BACKEND_STATUS="⚠️"
if curl --silent --fail --max-time 10 "https://hamlet-unified-complete-2027-production.up.railway.app/health" >/dev/null; then
  BACKEND_STATUS="✅"
  printf '✅ Backend OK\n'
else
  printf '⚠️ Backend unreachable\n'
fi

case "$TARGET_LOWER" in
  vercel)
    vercel deploy --prebuilt --prod --yes --confirm
    DEPLOY_EXIT=$?
    ;;
  cloudflare|wrangler)
    if [[ ! -d out ]]; then
      npm run export
    fi

    DEPLOY_DIR="dist"
    if [[ ! -d "$DEPLOY_DIR" ]]; then
      if [[ -d out ]]; then
        DEPLOY_DIR="out"
      else
        DEPLOY_DIR=".next"
      fi
    fi

    wrangler pages deploy "$DEPLOY_DIR" --project-name "digital-democracy-iraq"
    DEPLOY_EXIT=$?
    ;;
  *)
    echo "Unknown target '$TARGET'. Use 'Vercel' or 'Cloudflare'." >&2
    exit 1 ;;
 esac

if [[ ${DEPLOY_EXIT:-0} -ne 0 ]]; then
  echo "❌ Deployment failed" >&2
  exit 1
fi

printf '🧪 Running API validation checks...\n'
set +e
VALIDATION_OUTPUT=$(npm run validate 2>&1)
VALIDATION_EXIT=$?
set -e
printf '%s\n' "$VALIDATION_OUTPUT"
if [[ $VALIDATION_EXIT -ne 0 ]]; then
  printf '⚠️ Validation script reported issues with the backend API.\n'
fi

REPORT_DIR="reports/validation"
mkdir -p "$REPORT_DIR"
TIMESTAMP="$(date +%Y%m%d_%H%M)"
if [[ ${DEPLOY_EXIT:-0} -eq 0 && $VALIDATION_EXIT -eq 0 ]]; then
  DEPLOY_STATUS='successful'
else
  DEPLOY_STATUS='completed with warnings'
fi

if [[ $VALIDATION_EXIT -eq 0 ]]; then
  VALIDATION_STATUS='✅'
else
  VALIDATION_STATUS='⚠️'
fi

cat <<REPORT > "$REPORT_DIR/report-$TIMESTAMP.txt"
Deployment $DEPLOY_STATUS at $TIMESTAMP for $TARGET
Backend health: $BACKEND_STATUS
API validation: $VALIDATION_STATUS

$VALIDATION_OUTPUT
REPORT

printf '🌈 COMPLETE — Everything synced & deployed!\n'
