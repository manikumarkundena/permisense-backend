import { Router } from 'express';
import { securityLogger } from '../utils/logger.ts';
import { RiskLevel } from '../models/types.ts';
import { RuleEngine } from '../services/engine.ts';

const router = Router();

router.post('/simulate-attack', (req, res) => {
  const vectors = [
    { type: 'Exfiltration', description: 'Unauthorized attempt to access and extract system files.' },
    { type: 'RAT', description: 'Remote Access Trojan activity detected with C2 communication.' },
    { type: 'Infiltration', description: 'Brute force attack on authentication endpoint.' },
    { type: 'Privilege Escalation', description: 'Attempted exploitation of a known kernel vulnerability.' }
  ];
  
  const stages = [
    ['Reconnaissance', 'Scanning open ports', 'Identifying vulnerable services'],
    ['Exploitation', 'Deploying payload', 'Bypassing WAF'],
    ['Execution', 'Running remote code', 'Gaining reverse shell'],
    ['Exfiltration', 'Packaging data', 'Sending data over DNS tunnel']
  ];

  const scenario = vectors[Math.floor(Math.random() * vectors.length)];
  const statusPool = ['BLOCKED', 'PARTIAL', 'SUCCESS'];
  const status = statusPool[Math.floor(Math.random() * statusPool.length)];

  // Generate dynamic path
  const pathLength = Math.floor(Math.random() * 3) + 2; // 2 to 4 stages
  const attackPath = stages.slice(0, pathLength).map(s => s[0] + ': ' + s[Math.floor(Math.random() * 2) + 1]);

  let baseRisk = status === 'SUCCESS' ? 95 : status === 'PARTIAL' ? 70 : 30;
  const riskScore = RuleEngine.addRandomness(baseRisk);
  const riskLevel = RuleEngine.getRiskLevel(riskScore);

  securityLogger.log(`SIMULATION: ${scenario.type} -> ${status}`, riskLevel, 'SIMULATION', scenario.description);
  
  res.json({
    status,
    riskScore,
    riskLevel,
    confidence: Math.round((0.85 + Math.random() * 0.1) * 100) / 100, // 0.85 to 0.95
    vulnerabilities: [scenario.type + ' Vector'],
    attackPath,
    explanation: status === 'SUCCESS' 
      ? `The system failed to block the ${scenario.type} simulation. The attack successfully progressed through multiple stages.`
      : status === 'PARTIAL'
        ? `The ${scenario.type} was detected but partially executed before containment.`
        : `The system successfully blocked the ${scenario.type} simulation during the early stages.`,
    recommendation: status === 'SUCCESS' || status === 'PARTIAL'
      ? "Immediate patching of exposed services and implementation of stricter access controls required."
      : "Current defenses held, but continuous monitoring of boundary networks is recommended.",
    cause: attackPath[attackPath.length - 1],
    insights: [scenario.description, ...attackPath]
  });
});

export default router;
