"use JSX";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import assignmentRoutes from './routes/assignment.routes.js';
import patternRoutes from './routes/pattern.routes.js';
import vaultRoutes from './routes/vault.routes.js';
import { initAssessmentWorker } from './workers/assessment.worker.js'; 
import { initVaultWorker } from './workers/vaultWorker.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize Core Database Engine
connectDB();

// 🚀 WORKER INITIALIZATION (Consolidated cleanly at the top)
initAssessmentWorker();
initVaultWorker(); 

// Mount Routes Cleanly
app.use('/api/assignments', assignmentRoutes);
app.use('/api/patterns', patternRoutes);
app.use('/api/vault', vaultRoutes);

// 💖 FIXED: Added absolute root domain handler to eliminate "Cannot GET /" page on Render URL clicks
app.get('/', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'AI Assessment Creator API Production Server Active',
    documentation: 'Append /health or /api/[endpoint] to access system resources.'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'Assessment Creator Backend Server is running smoothly.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Production engine humming along at: http://localhost:${PORT}`);
});