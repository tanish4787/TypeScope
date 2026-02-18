import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sessionRoutes from './routes/sessionRoutes.js';
import { connectDB } from './config/db.js';
import { setDbAvailability } from './controllers/sessionController.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'typescope-api' });
});

app.use('/api/sessions', sessionRoutes);

const dbReady = await connectDB(process.env.MONGODB_URI);
setDbAvailability(dbReady);

app.listen(PORT, () => {
  console.log(`[server] running on http://localhost:${PORT}`);
});
