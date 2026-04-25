import { RiskLevel } from '../models/types.ts';

export class RuleEngine {

  static getRiskLevel(score: number): RiskLevel {
    if (score >= 85) return RiskLevel.CRITICAL;
    if (score >= 65) return RiskLevel.HIGH;
    if (score >= 35) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  // 🔥 PERMISSION ANALYSIS (UNCHANGED)
  static calculatePermissionRisk(permissions: string[]) {
    let score = 0;
    const perms = permissions.map(p => p.toUpperCase());

    if (perms.includes('SMS') && perms.includes('INTERNET')) score += 50;
    if (perms.includes('CAMERA') && perms.includes('MIC') && perms.includes('INTERNET')) score += 40;

    if (perms.includes('BACKGROUND')) score += 20;
    if (perms.includes('LOCATION')) score += 25;
    if (perms.includes('STORAGE')) score += 15;
    if (perms.includes('CONTACTS')) score += 30;

    score = Math.min(100, score);

    return {
      riskScore: score,
      riskLevel: this.getRiskLevel(score),
      confidence: 0.92,
      recommendation: score > 60
        ? "CRITICAL: Revoke permissions immediately."
        : "Proceed with caution."
    };
  }

  // 🔥 FIXED POLICY ANALYSIS (MAIN UPGRADE)
  static analyzePolicyHeuristics(text: string) {
    let score = 0;
    const lowerText = text.toLowerCase();

    // 🔥 BROAD KEYWORD DETECTION
    if (lowerText.includes('third party') || lowerText.includes('share')) {
      score += 20;
    }

    if (lowerText.includes('retain') || lowerText.includes('retention')) {
      score += 15;
    }

    if (lowerText.includes('collect') || lowerText.includes('data')) {
      score += 15;
    }

    if (lowerText.includes('location')) {
      score += 20;
    }

    if (lowerText.includes('track') || lowerText.includes('tracking')) {
      score += 20;
    }

    if (lowerText.includes('biometric')) {
      score += 30;
    }

    if (lowerText.includes('sell') && lowerText.includes('data')) {
      score += 40;
    }

    if (lowerText.includes('advertising') || lowerText.includes('marketing')) {
      score += 15;
    }

    // 🔥 AVOID FAKE 0 SCORE
    if (score === 0 && text.length > 200) {
      score = 30;
    }

    // 🔥 NORMALIZE SCORE
    score = Math.min(100, score);

    return {
      riskScore: score,
      riskLevel: this.getRiskLevel(score),
      confidence: Math.min(0.95, 0.6 + text.length / 10000)
    };
  }

  // 🔥 BEHAVIOR ANALYSIS (UNCHANGED)
  static detectBehaviorAnomalies(activity: any[]) {
    const insights: string[] = [];

    const backgroundUsage = activity.filter(a => a.isBackground);
    if (backgroundUsage.length > 5) {
      insights.push("Excessive background activity detected in a short window.");
    }

    const unusualHours = activity.filter(a => {
      const hour = new Date(a.timestamp).getHours();
      return hour < 6 || hour > 22;
    });

    if (unusualHours.length > 2) {
      insights.push("Suspicious activity during off-peak hours detected.");
    }

    return insights;
  }
}