import { RuleEngine } from './engine.ts';

export class RiskEngineService {
  static calculateGlobalRisk(data: {
    policyScore: number;
    permissionScore: number;
    behaviorScore: number;
    simulationScore: number;
  }) {
    // Weighted average for final system score
    const weights = {
      policy: 0.2,
      permission: 0.3,
      behavior: 0.3,
      simulation: 0.2
    };

    let baseScore = 
      (data.policyScore * weights.policy) +
      (data.permissionScore * weights.permission) +
      (data.behaviorScore * weights.behavior) +
      (data.simulationScore * weights.simulation);

    const finalScore = RuleEngine.addRandomness(baseScore);
    const level = RuleEngine.getRiskLevel(finalScore);

    const summary = level === 'CRITICAL' || level === 'HIGH'
      ? "System is under significant risk based on aggregated intelligence."
      : level === 'MEDIUM'
        ? "Elevated risk detected. Monitoring recommended."
        : "System operating within acceptable risk parameters.";

    return {
      finalScore,
      level,
      breakdown: {
        policy: data.policyScore,
        permissions: data.permissionScore,
        behavior: data.behaviorScore,
        simulation: data.simulationScore
      },
      summary
    };
  }
}
