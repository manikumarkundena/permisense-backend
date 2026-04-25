import { Router } from 'express';
import { SecurityService } from '../services/security.ts';
import { securityLogger } from '../utils/logger.ts';

const router = Router();

router.get('/logs', (req, res) => {
  res.json(securityLogger.getLogs());
});

router.post('/monitor-behavior', (req, res) => {
  const { appId, activity } = req.body;
  if (!appId) return res.status(400).json({ error: 'App ID required' });

  const result = SecurityService.monitorBehavior(appId, activity || []);
  securityLogger.log(`Behavior monitor update for ${appId}`, result.riskLevel);
  
  res.json(result);
});

export default router;
