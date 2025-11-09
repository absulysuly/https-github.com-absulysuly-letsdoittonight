import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsConfig));

app.use(express.json());

app.options('*', cors(corsConfig));

// Global variable to store candidates
let candidates = [];
let candidatesLoadedAt = null;

// CSV Import Function
async function importCandidates() {
    try {
        const dataDir = path.join(__dirname, 'data');
        const csvPath = path.join(dataDir, 'MASTER_CANDIDATES_7769.csv');

        console.log('🔍 Looking for CSV file at:', csvPath);

        if (!fs.existsSync(csvPath)) {
            throw new Error(`Candidate CSV not found at ${csvPath}`);
        }

        console.log('📁 CSV file found, reading...');
        const csvText = await fs.promises.readFile(csvPath, 'utf8');

        const { data: records, errors } = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            transform: (value) => value.trim()
        });

        if (errors.length > 0) {
            console.warn('CSV parsing warnings:', errors);
        }

        candidates = records.filter(record => record.full_name && record.full_name.trim() !== '');

        candidatesLoadedAt = new Date();
        console.log(`✅ Successfully loaded ${candidates.length} candidates from CSV`);
        return candidates;
    } catch (error) {
        console.error('❌ CSV import failed:', error.message);
        throw error;
    }
}

// API Routes
app.get('/api/stats', (req, res) => {
    res.json({
        status: 'ok',
        totalCandidates: candidates.length,
        loadedAt: candidatesLoadedAt ? candidatesLoadedAt.toISOString() : null,
    });
});

const normalizeQuery = (value) => (typeof value === 'string' ? value.trim() : '');

app.get('/api/candidates', (req, res) => {
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

    res.json({
        data: paginatedCandidates,
        total: filteredCandidates.length,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(filteredCandidates.length / limit)),
    });
});

app.get('/api/candidates/:id', (req, res) => {
    const requestedId = String(req.params.id);
    const candidate = candidates.find(c => String(c.id) === requestedId);
    if (!candidate) {
        return res.status(404).json({ error: "Candidate not found" });
    }
    res.json(candidate);
});

const buildHealthPayload = () => ({
    status: 'ok',
    time: Date.now(),
    totalCandidates: candidates.length,
    uptime: process.uptime(),
});

app.get('/api/health', (req, res) => {
    res.json(buildHealthPayload());
});

app.get('/health', (req, res) => {
    res.json(buildHealthPayload());
});

// Serve static files from frontend dist directory
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
    console.log('📁 Serving frontend from:', distPath);
    app.use(express.static(distPath));

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
    console.error('Error:', err.stack);
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
