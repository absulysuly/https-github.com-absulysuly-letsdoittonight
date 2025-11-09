import { createServer } from 'node:http';
import { URL } from 'node:url';
import { importCandidates, candidates } from './importCandidates.mjs';

const PORT = Number(process.env.PORT ?? 4001);

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
    });
    response.end(JSON.stringify(payload));
}

function getPaginationParams(url) {
    const pageParam = url.searchParams.get('page');
    const limitParam = url.searchParams.get('limit');

    const page = Number.parseInt(pageParam ?? '1', 10);
    const limit = Number.parseInt(limitParam ?? '50', 10);

    return {
        page: Number.isNaN(page) || page < 1 ? 1 : page,
        limit: Number.isNaN(limit) || limit < 1 ? 50 : Math.min(limit, 200),
    };
}

function buildStats() {
    const totals = {
        total: candidates.length,
        gender: {},
        governorates: {},
    };

    for (const candidate of candidates) {
        const genderKey = (candidate.gender ?? 'Unknown').trim() || 'Unknown';
        totals.gender[genderKey] = (totals.gender[genderKey] ?? 0) + 1;

        const governorateKey = (candidate.governorate ?? 'Unknown').trim() || 'Unknown';
        totals.governorates[governorateKey] = (totals.governorates[governorateKey] ?? 0) + 1;
    }

    return totals;
}

function handleCandidatesRequest(url, response) {
    const { page, limit } = getPaginationParams(url);
    const start = (page - 1) * limit;
    const end = start + limit;
    const total = candidates.length;
    const pageData = candidates.slice(start, end);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return sendJson(response, 200, {
        data: pageData,
        meta: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    });
}

function handleStatsRequest(response) {
    return sendJson(response, 200, buildStats());
}

await importCandidates();
console.log('✅ 7,769 candidates imported successfully');

const server = createServer((request, response) => {
    if (!request.url) {
        return sendJson(response, 400, { error: 'Invalid request' });
    }

    const url = new URL(request.url, `http://${request.headers.host ?? `localhost:${PORT}`}`);

    if (request.method === 'GET' && url.pathname === '/api/candidates') {
        return handleCandidatesRequest(url, response);
    }

    if (request.method === 'GET' && url.pathname === '/api/stats') {
        return handleStatsRequest(response);
    }

    if (request.method === 'OPTIONS') {
        response.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        });
        return response.end();
    }

    return sendJson(response, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});
