import { RuleEngine } from './engine.ts';
import { AIService } from './ai_service.ts';
import { RiskLevel } from '../models/types.ts';

export class SecurityService {
  static async analyzeAppPermissions(appName: string, permissions: string[]) {
    const ruleResult = RuleEngine.calculatePermissionRisk(permissions);
    
    // Enrich with AI
    const aiExplanation = await AIService.explainPermissionsWithAI(appName, permissions, ruleResult);
    
    return {
      riskScore: ruleResult.riskScore,
      riskLevel: ruleResult.riskLevel,
      confidence: ruleResult.confidence,
      explanation: aiExplanation,
      recommendation: ruleResult.recommendation,
      insights: []
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

  static monitorBehavior(appId: string, activity: any[]) {
    const insights = RuleEngine.detectBehaviorAnomalies(activity);
    const updatedRisk = insights.length > 0 ? RiskLevel.HIGH : RiskLevel.LOW;
    
    return {
      riskScore: updatedRisk === RiskLevel.HIGH ? 70 : 10,
      riskLevel: updatedRisk,
      confidence: 0.9,
      explanation: updatedRisk === RiskLevel.HIGH ? "System detecting rapid background resource access." : "No anomalies detected.",
      recommendation: updatedRisk === RiskLevel.HIGH ? "Quarantine application and review logs." : "Continue monitoring.",
      insights
    };
  }
}
