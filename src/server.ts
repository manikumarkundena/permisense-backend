import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { config } from './core/config.ts';
import router from './routes/index.ts';

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // 🔥 API Routes
  app.use('/api', router);

  // 🔥 Health route (important for Render check)
  app.get('/', (req, res) => {
    res.send(`${config.appName} Backend v${config.version} Running 🚀`);
  });

  const host = '0.0.0.0';

  app.listen(config.port, host, () => {
    console.log(`[SYSTEM] ${config.appName} Backend v${config.version} Online`);
    console.log(`[SYSTEM] URL: http://${host}:${config.port}`);
  });
}

startServer().catch(err => {
  console.error('[FATAL] Server failed to start:', err);
  process.exit(1);
});