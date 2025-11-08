const BASE_URL = 'https://hamlet-unified-complete-2027-production.up.railway.app';
const ENDPOINTS = [
  '/api/candidates/stats',
  '/api/candidates',
  '/api/posts',
  '/api/events',
  '/api/dashboard/stats',
  '/health',
];

async function probeEndpoint(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { method: 'GET' });
    return { endpoint, status: response.status, ok: response.ok };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { endpoint, status: null, ok: false, error: message };
  }
}

async function runValidation() {
  console.log('🔍 Validating backend endpoints...');

  const results = await Promise.all(ENDPOINTS.map((endpoint) => probeEndpoint(endpoint)));
  let hasFailures = false;

  for (const result of results) {
    if (result.ok) {
      console.log(`${result.endpoint}: ✅ ${result.status}`);
    } else {
      hasFailures = true;
      console.log(`${result.endpoint}: ❌ ${result.error ?? result.status}`);
    }
  }

  if (hasFailures) {
    process.exitCode = 1;
  }
}

runValidation().catch((error) => {
  console.error('Unexpected validation failure', error);
  process.exit(1);
});
