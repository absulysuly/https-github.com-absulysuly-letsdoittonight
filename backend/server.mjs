import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import compression from 'compression';
import helmet from 'helmet';
import { fileURLToPath } from 'url';

import healthRoutes from './src/routes/health.js';
import statsRoutes from './src/routes/stats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(compression());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

const defaultAllowedOrigins = [
    'https://digitaldemocracy-iraq.vercel.app',
    'https://hamlet-unified-complete-2027.vercel.app',
    'http://localhost:5173',
    '*.vercel.app',
];

const envOriginCandidates = [
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_FRONTEND_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.ORIGIN,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
].filter(Boolean).map(origin => origin.trim());

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envOriginCandidates]));

const isAllowedOrigin = (origin) => {
    return allowedOrigins.some((allowed) => {
        if (allowed === '*') {
            return true;
        }
        if (allowed.startsWith('*.')) {
            const suffix = allowed.slice(1);
            return origin.endsWith(suffix);
        }
        return allowed === origin;
    });
};

if (process.env.NODE_ENV !== 'production') {
    console.log('CORS allowed origins:', allowedOrigins);
}

const corsConfig = {
    origin: (origin, callback) => {
        if (!origin || isAllowedOrigin(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86_400,
};

app.use(cors(corsConfig));

app.use(express.json());

app.options('*', cors(corsConfig));

// Global variable to store candidates
let candidates = [];
let candidatesLoadedAt = null;
const cacheFile = path.join(__dirname, 'data', 'candidates_cache.json');
const cache = new Map();

app.locals.getCandidateCount = () => candidates.length;
app.locals.getCandidatesLoadedAt = () => (candidatesLoadedAt ? candidatesLoadedAt.toISOString() : null);

// CSV Import Function with cache fallback
async function importCandidates() {
    const dataDir = path.join(__dirname, 'data');
    const csvPath = path.join(dataDir, 'MASTER_CANDIDATES_7769.csv');

    try {
        console.log('🔍 Loading candidates...');
        if (!fs.existsSync(csvPath)) throw new Error('CSV file not found, attempting cache fallback');

        const csvText = await fs.promises.readFile(csvPath, 'utf8');
        const { data: records, errors } = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            transform: (value) => value.trim(),
        });

        if (errors.length > 0) console.warn('CSV parse warnings:', errors);
        candidates = records.filter((r) => r.full_name && r.full_name.trim() !== '');

        await fs.promises.writeFile(cacheFile, JSON.stringify(candidates, null, 2));
        candidatesLoadedAt = new Date();
        cache.clear();
        console.log(`✅ CSV imported successfully (${candidates.length} candidates). Cache saved.`);
    } catch (error) {
        console.error('⚠️ Failed to import CSV:', error.message);

        if (fs.existsSync(cacheFile)) {
            console.log('♻️ Loading from local cache...');
            const cacheText = await fs.promises.readFile(cacheFile, 'utf8');
            candidates = JSON.parse(cacheText);
            candidatesLoadedAt = new Date(fs.statSync(cacheFile).mtime);
            cache.clear();
            console.log(`✅ Loaded ${candidates.length} cached candidates.`);
        } else {
            console.warn('❌ No cache found. Serving empty dataset.');
            candidates = [];
            candidatesLoadedAt = new Date();
            cache.clear();
        }
    }
}

setInterval(async () => {
    if (candidates.length > 0) {
        try {
            await fs.promises.writeFile(cacheFile, JSON.stringify(candidates, null, 2));
            console.log('💾 Candidate cache refreshed.');
        } catch (error) {
            console.error('⚠️ Failed to refresh candidate cache:', error);
        }
    }
}, 5 * 60 * 1000);

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/stats', statsRoutes);

const normalizeQuery = (value) => (typeof value === 'string' ? value.trim() : '');

app.get('/api/candidates', (req, res) => {
    const key = `${req.originalUrl}`;
    if (cache.has(key)) {
        return res.set('X-Cache', 'HIT').json(cache.get(key));
    }

    const rawPage = Number.parseInt(req.query.page, 10) || 1;
    const rawLimit = Number.parseInt(req.query.limit, 10) || 10;
    const page = Math.max(1, rawPage);
    const limit = Math.max(1, Math.min(500, rawLimit));
    const searchTerm = normalizeQuery(req.query.search).toLowerCase();
    const governorate = normalizeQuery(req.query.governorate).toLowerCase();
    const party = normalizeQuery(req.query.party).toLowerCase();
    const gender = normalizeQuery(req.query.gender).toLowerCase();

    let filteredCandidates = candidates;

    if (governorate) {
        filteredCandidates = filteredCandidates.filter(candidate => candidate.governorate?.toLowerCase() === governorate);
    }

    if (party) {
        filteredCandidates = filteredCandidates.filter(candidate => candidate.party?.toLowerCase() === party);
    }

    if (gender) {
        filteredCandidates = filteredCandidates.filter(candidate => candidate.gender?.toLowerCase() === gender);
    }

    if (searchTerm) {
        filteredCandidates = filteredCandidates.filter(candidate => {
            const name = candidate.full_name?.toLowerCase() || '';
            return name.includes(searchTerm);
        });
    }

    const startIndex = (page - 1) * limit;
    const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + limit);

    const response = {
        data: paginatedCandidates,
        total: filteredCandidates.length,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(filteredCandidates.length / limit)),
    };
    cache.set(key, response);
    res.set('X-Cache', 'MISS').json(response);
});

app.get('/api/candidates/:id', (req, res) => {
    const requestedId = String(req.params.id);
    const candidate = candidates.find(c => String(c.id) === requestedId);
    if (!candidate) {
        return res.status(404).json({ error: "Candidate not found" });
    }
    res.json(candidate);
});

app.get('/api/cache/status', (req, res) => {
    res.json({
        cached: fs.existsSync(cacheFile),
        candidates: candidates.length,
        lastModified: fs.existsSync(cacheFile) ? fs.statSync(cacheFile).mtime : null,
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        candidateCount: candidates.length,
        timestamp: new Date().toISOString(),
    });
});

// Serve static files from frontend dist directory
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
    console.log('📁 Serving frontend from:', distPath);
    app.use(express.static(distPath, {
        maxAge: '7d',
        etag: true,
        lastModified: true,
    }));

    // SPA fallback - serve index.html for all non-API routes
    app.get('*', (req, res, next) => {
        // Skip API routes
        if (req.path.startsWith('/api') || req.path === '/health') {
            return next();
        }
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    console.log('⚠️  Frontend dist not found. Serving API only.');
    // Root endpoint (only if no frontend)
    app.get('/', (req, res) => {
        res.json({
            message: "Hamlet Election Platform API",
            version: "1.0.0",
            endpoints: {
                stats: "/api/stats",
                candidates: '/api/candidates',
                candidate: '/api/candidates/:id',
                health: '/api/health'
            }
        });
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    if (err?.message === 'Not allowed by CORS') {
        console.warn('CORS rejection for origin:', req.get('origin'));
        return res.status(403).json({ error: 'CORS: Origin not allowed' });
    }

    console.error('Error:', err.stack || err);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize and start server
async function startServer() {
    try {
        console.log('🚀 Starting Hamlet Election Platform Backend...');

        // Load candidates before starting server
        await importCandidates();

        const PORT = process.env.PORT || 4001;
        const server = app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`📊 API ready → ${candidates.length} candidates loaded`);
            console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
            console.log(`📈 Stats: http://localhost:${PORT}/api/stats`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received, shutting down gracefully');
            server.close(() => {
                console.log('Process terminated');
            });
        });

    } catch (error) {
        console.error('💥 Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();
