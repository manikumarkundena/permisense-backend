import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { config } from './core/config.ts';
import router from './routes/index.ts';

async function startServer() {
  const app = express();
  
  app.use(cors());
  app.use(express.json());

  // Register Routes
  app.use('/api', router);

  // Serve Frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

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
