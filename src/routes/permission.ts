import { Router } from 'express';
import { SecurityService } from '../services/security.ts';
import { securityLogger } from '../utils/logger.ts';

const router = Router();

router.post('/analyze-permissions', async (req, res) => {
  const { appName, permissions } = req.body;
  if (!appName) return res.status(400).json({ error: 'App name required' });

  const result = await SecurityService.analyzeAppPermissions(appName, permissions || []);
  securityLogger.log(`Permission scan for ${appName}. Risk: ${result.riskLevel}`, result.riskLevel);
  
  res.json(result);
});

export default router;
