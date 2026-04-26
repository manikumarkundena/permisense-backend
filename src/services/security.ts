import { RuleEngine } from './engine.ts';
import { AIService } from './ai_service.ts';
import { RiskLevel, BehaviorData } from '../models/types.ts';

export class SecurityService {
  static async analyzeAppPermissions(appName: string, permissions: string[]) {
    const ruleResult = RuleEngine.calculatePermissionRisk(permissions);
    
    // Enrich with AI
    const aiExplanation = await AIService.explainPermissionsWithAI(appName, permissions, ruleResult);
    
    return {
      riskScore: ruleResult.riskScore,
      riskLevel: ruleResult.riskLevel,
      confidence: ruleResult.confidence,
      explanation: aiExplanation.explanation,
      cause: aiExplanation.cause,
      recommendation: aiExplanation.recommendation,
      reasons: ruleResult.reasons,
      misuseScenarios: ruleResult.misuseScenarios,
      saferAlternatives: ruleResult.saferAlternatives,
      insights: ruleResult.reasons
    };
  }

  static async analyzePolicy(text: string) {
    const ruleResult = RuleEngine.analyzePolicyHeuristics(text);
    
    // Enrich with AI
    const aiResult = await AIService.analyzePolicyWithAI(text, ruleResult);
    
    return {
      riskScore: ruleResult.riskScore,
      riskLevel: ruleResult.riskLevel,
      confidence: ruleResult.confidence,
      explanation: aiResult.summary,
      summary: aiResult.summary,
      recommendation: aiResult.recommendation,
      highlightedRisks: aiResult.highlightedRisks,
      categories: aiResult.categories,
      insights: []
    };
  }

  static monitorBehavior(appId: string, data: BehaviorData) {
    const result = RuleEngine.detectBehaviorAnomalies(data);
    
    const explanation = result.riskLevel === RiskLevel.HIGH || result.riskLevel === RiskLevel.CRITICAL
      ? "System detected significant anomalous behavior patterns in telemetry data."
      : result.riskLevel === RiskLevel.MEDIUM 
        ? "Some unusual activity noticed, monitoring recommended."
        : "No significant anomalies detected in recent telemetry.";

    const recommendation = result.riskLevel === RiskLevel.HIGH || result.riskLevel === RiskLevel.CRITICAL
      ? "Quarantine application, block network egress, and review telemetry logs."
      : "Continue standard monitoring.";

    return {
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      confidence: 0.9,
      explanation,
      recommendation,
      insights: result.insights,
      cause: result.insights.join(' ') || "Routine operational telemetry."
    };
  }
}
