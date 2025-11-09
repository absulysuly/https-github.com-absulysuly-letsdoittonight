import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// CORS configuration - update with your frontend URLs
const allowedOrigins = [
    "https://your-frontend-domain.vercel.app",
    "http://localhost:3000",
    "https://localhost:3000"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Global variable to store candidates
let candidates = [];

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

        candidates = records.filter(record => record.name && record.name.trim() !== '');

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
        totalCandidates: candidates.length,
        loadedAt: new Date().toISOString()
    });
});

app.get('/api/candidates', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedCandidates = candidates.slice(startIndex, endIndex);

    res.json({
        data: paginatedCandidates,
        total: candidates.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(candidates.length / limit)
    });
});

app.get('/api/candidates/:id', (req, res) => {
    const candidate = candidates.find(c => c.id === req.params.id);
    if (!candidate) {
        return res.status(404).json({ error: "Candidate not found" });
    }
    res.json(candidate);
});

app.get('/health', (req, res) => {
    res.json({
        status: "ok",
        total_candidates: candidates.length,
        timestamp: Date.now(),
        uptime: process.uptime()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: "Hamlet Election Platform API",
        version: "1.0.0",
        endpoints: {
            stats: "/api/stats",
            candidates: "/api/candidates",
            candidate: "/api/candidates/:id",
            health: "/health"
        }
    });
});

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
            console.log(`🌐 Health check: http://localhost:${PORT}/health`);
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
