import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { importCandidates, candidates } from './importCandidates.mjs';

const DEFAULT_PORT = Number.parseInt(process.env.PORT ?? '4001', 10);
const FALLBACK_PORT = Number.parseInt(process.env.FALLBACK_PORT ?? `${DEFAULT_PORT + 1}`, 10);

/**
 * Parses a list pagination query from an Express request.
 * @param {import('express').Request} request
 */
function getPaginationParams(request) {
    const page = Number.parseInt(request.query.page ?? '1', 10);
    const limit = Number.parseInt(request.query.limit ?? '50', 10);

    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
    const safeLimit = Number.isNaN(limit) || limit < 1 ? 50 : Math.min(limit, 200);

    return { page: safePage, limit: safeLimit };
}

/**
 * Filters the candidate list by the provided query.
 * @param {string} query
 */
function filterCandidatesByQuery(query) {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
        return [];
    }

    return candidates.filter((candidate) =>
        Object.values(candidate)
            .filter((value) => value !== null && value !== undefined)
            .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
    );
}

/**
 * Attempts to bind the Express server to an available port, retrying the fallback if the
 * preferred port is already taken.
 * @param {import('express').Express} app
 * @param {number} port
 * @param {number} fallbackPort
 */
async function listenWithFallback(app, port, fallbackPort) {
    const listen = (targetPort) =>
        new Promise((resolve, reject) => {
            const server = app.listen(targetPort);

            const handleError = (error) => {
                server.removeListener('listening', handleListening);
                reject(Object.assign(error, { port: targetPort }));
            };

            const handleListening = () => {
                server.removeListener('error', handleError);
                resolve({ server, port: targetPort });
            };

            server.once('error', handleError);
            server.once('listening', handleListening);
        });

    try {
        return await listen(port);
    } catch (error) {
        if (error?.code === 'EADDRINUSE' && fallbackPort !== port) {
            console.warn(
                `⚠️  Port ${port} is busy. Retrying on port ${fallbackPort}...`,
            );
            return listen(fallbackPort);
        }

        throw error;
    }
}

try {
    await importCandidates();
    console.log(`✅ ${candidates.length.toLocaleString()} candidates imported successfully`);
} catch (error) {
    console.error('❌ Failed to import candidate CSV:', error);
    process.exitCode = 1;
    throw error;
}

const app = express();

app.set('trust proxy', 1);
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

app.get('/health', (request, response) => {
    response.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/stats', (request, response) => {
    response.json({ totalCandidates: candidates.length });
});

app.get('/api/candidates', (request, response) => {
    const { page, limit } = getPaginationParams(request);
    const start = (page - 1) * limit;
    const end = start + limit;
    const total = candidates.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    response.json({
        data: candidates.slice(start, end),
        meta: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    });
});

app.get('/api/search', (request, response) => {
    const { q = '' } = request.query;

    if (typeof q !== 'string') {
        return response.status(400).json({ error: 'Query parameter "q" must be a string' });
    }

    const results = filterCandidatesByQuery(q);

    return response.json({
        data: results,
        meta: {
            total: results.length,
            query: q,
        },
    });
});

app.use((request, response) => {
    response.status(404).json({ error: 'Not found' });
});

try {
    const { server, port } = await listenWithFallback(app, DEFAULT_PORT, FALLBACK_PORT);
    process.env.PORT = String(port);

    const handleShutdown = () => {
        console.log('Received shutdown signal. Closing server...');
        server.close(() => {
            console.log('Server closed gracefully');
            process.exit(0);
        });
    };

    process.on('SIGTERM', handleShutdown);
    process.on('SIGINT', handleShutdown);

    console.log(`Backend listening on port ${port}`);
} catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exitCode = 1;
}
