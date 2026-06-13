import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import assignmentRoutes from './routes/assignment.routes.js';
import patternRoutes from './routes/pattern.routes.js';
import vaultRoutes from './routes/vault.routes.js';
import { initAssessmentWorker } from './workers/assessment.worker.js'; // 💡 Fixed spelling block match!
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize Core Database Engine
connectDB();

// Explicitly start the BullMQ background worker thread
initAssessmentWorker();

// Mount Routes Cleanly (No Duplicates)
app.use('/api/assignments', assignmentRoutes);
app.use('/api/patterns', patternRoutes);
app.use('/api/vault', vaultRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'Assessment Creator Backend Server is running smoothly.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Production engine humming along at: http://localhost:${PORT}`);
});