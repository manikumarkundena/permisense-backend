import { Router } from 'express';
import { RiskEngineService } from '../services/risk_engine.ts';
import { securityLogger } from '../utils/logger.ts';

const router = Router();

router.post('/calculate-risk', (req, res) => {
  const { policy, permissions, behavior, simulation } = req.body;

  const data = {
    policyScore: policy || 0,
    permissionScore: permissions || 0,
    behaviorScore: behavior || 0,
    simulationScore: simulation || 0
  };

  const result = RiskEngineService.calculateGlobalRisk(data);

  securityLogger.log(
    `Global Risk Calculated. Score: ${result.finalScore}`,
    result.level,
    'SYSTEM',
    `Breakdown: P=${data.policyScore}, Per=${data.permissionScore}, B=${data.behaviorScore}, S=${data.simulationScore}`
  );

  res.json(result);
});

export default router;
