import express from 'express';
import cors from 'cors';
import salesRoutes from './salesRoutes.js';
import { loadSalesData } from './dataLoader.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load data on startup (cached for serverless)
let salesData = [];
let dataLoaded = false;

async function ensureDataLoaded() {
  if (!dataLoaded) {
    try {
      salesData = await loadSalesData();
      dataLoaded = true;
      console.log(`Loaded ${salesData.length} sales records`);
    } catch (err) {
      console.error('Error loading data:', err);
      salesData = [];
    }
  }
}

// Middleware to ensure data is loaded and make it available to routes
// Quick request logger to help diagnose NOT_FOUND on Vercel deployments
app.use((req, res, next) => {
  try {
    console.log(`[api] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  } catch (e) {
    // ignore logging errors
  }
  next();
});

app.use(async (req, res, next) => {
  await ensureDataLoaded();
  req.app.locals.salesData = salesData;
  next();
});

// Routes (when invoked via Vercel, /api prefix is already stripped by router)
app.use('/sales', salesRoutes);

// Health check
app.get('/health', async (req, res) => {
  await ensureDataLoaded();
  res.json({ status: 'ok', records: salesData.length });
});

// 404 Handler - Must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `The requested resource '${req.method} ${req.originalUrl}' could not be found.`,
    availableEndpoints: [
      'GET /sales',
      'GET /sales/filter-options',
      'GET /health'
    ]
  });
});

// General Error Handler - Must be last
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred'
  });
});

// Export the Express app as a serverless function
export default app;

