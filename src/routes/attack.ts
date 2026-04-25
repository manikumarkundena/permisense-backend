import { Router } from 'express';
import { securityLogger } from '../utils/logger.ts';
import { RiskLevel } from '../models/types.ts';

const router = Router();

router.post('/simulate-attack', (req, res) => {
  const scenarios = [
    { type: 'Exfiltration', description: 'Unauthorized attempt to access system files.' },
    { type: 'RAT', description: 'Remote Access Trojan activity detected.' },
    { type: 'Infiltration', description: 'Brute force attack on authentication endpoint.' }
  ];
  
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  securityLogger.log(`CRITICAL: ${scenario.type} Attempt`, RiskLevel.CRITICAL, scenario.description);
  
  res.json({
    status: 'detected',
    riskScore: 100,
    riskLevel: RiskLevel.CRITICAL,
    confidence: 1.0,
    explanation: `The system detected a ${scenario.type} pattern corresponding to known threat signatures.`,
    recommendation: "Immediate quarantine of the affected process and rotation of credentials recommended.",
    insights: [scenario.description]
  });
});

export default router;
