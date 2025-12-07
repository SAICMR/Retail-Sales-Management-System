import express from 'express';
import cors from 'cors';
import salesRoutes from './routes/salesRoutes.js';
import { loadSalesData } from './utils/dataLoader.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load data on startup
let salesData = [];
loadSalesData().then(data => {
  salesData = data;
  console.log(`Loaded ${salesData.length} sales records`);
}).catch(err => {
  console.error('Error loading data:', err);
});

// Make data available to routes
app.locals.salesData = salesData;
app.use((req, res, next) => {
  req.app.locals.salesData = salesData;
  next();
});

// Routes
app.use('/api/sales', salesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', records: salesData.length });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

