import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// @ts-ignore - Type definitions don't align but runtime works
import handler from './api/submit-lead.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/submit-lead', async (req, res, next) => {
  try {
    // @ts-ignore - Vercel types differ from Express but work at runtime
    await handler(req, res);
  } catch (err) {
    next(err);
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[dev-api] Ready → http://localhost:${PORT}/api/submit-lead`);
});

server.on('error', (err: any) => {
  console.error('[dev-api] Server error:', err);
  process.exit(1);
});
