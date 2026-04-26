import { RiskLevel, BehaviorData, AdvancedPermissionRisk } from '../models/types.ts';

export class RuleEngine {

  static getRiskLevel(score: number): RiskLevel {
    if (score >= 85) return RiskLevel.CRITICAL;
    if (score >= 65) return RiskLevel.HIGH;
    if (score >= 35) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  // Add randomness utility
  static addRandomness(score: number): number {
    const variation = (Math.random() * 10) - 5; // ±5%
    let newScore = score + variation;
    return Math.max(0, Math.min(100, Math.round(newScore)));
  }

  // 🔥 PERMISSION ANALYSIS (UPGRADED)
  static calculatePermissionRisk(permissions: string[]): AdvancedPermissionRisk {
    let score = 0;
    const perms = permissions.map(p => p.toUpperCase());
    const reasons: string[] = [];
    const misuseScenarios: string[] = [];
    const saferAlternatives: string[] = [];

    // Combinations
    if (perms.includes('CAMERA') && perms.includes('MIC')) {
      score += 60;
      reasons.push("App can record audio and video simultaneously.");
      misuseScenarios.push("Silent background recording of the user's surroundings without consent.");
      saferAlternatives.push("Use scoped access or ask for permission only when actively recording.");
    }

    if (perms.includes('LOCATION') && perms.includes('INTERNET')) {
      score += 45;
      reasons.push("App can track and transmit live location data.");
      misuseScenarios.push("Building a persistent profile of the user's daily movements to sell to third parties.");
      saferAlternatives.push("Use coarse location or process location data locally without transmitting it.");
    }
    
    if (perms.includes('STORAGE') && perms.includes('CONTACTS')) {
      score += 50;
      reasons.push("App can read files and access the entire address book.");
      misuseScenarios.push("Exfiltrating the user's personal documents and friend network to an external server.");
      saferAlternatives.push("Use intent-based file pickers and contact pickers instead of broad storage/contacts access.");
    }

    if (perms.includes('BACKGROUND')) {
      score += 20;
      reasons.push("App operates in the background.");
    }

    if (perms.includes('SMS')) {
      score += 40;
      reasons.push("App can read and send SMS messages.");
      misuseScenarios.push("Intercepting MFA tokens or sending premium rate SMS messages.");
    }

    score = this.addRandomness(Math.min(100, score));

    // Avoid 0 score if permissions exist
    if (score === 0 && perms.length > 0) {
      score = this.addRandomness(15);
      reasons.push("General permissions requested.");
    }

    return {
      riskScore: score,
      riskLevel: this.getRiskLevel(score),
      confidence: 0.92,
      reasons,
      misuseScenarios,
      saferAlternatives
    };
  }

  // 🔥 FIXED POLICY ANALYSIS (UPGRADED WITH RANDOMNESS)
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
    score = this.addRandomness(Math.min(100, score));

    return {
      riskScore: score,
      riskLevel: this.getRiskLevel(score),
      confidence: Math.min(0.95, 0.6 + text.length / 10000)
    };
  }

  // 🔥 BEHAVIOR ANALYSIS (UPGRADED FOR REAL TELEMETRY)
  static detectBehaviorAnomalies(data: BehaviorData) {
    const insights: string[] = [];
    let riskScore = 10;

    if (data.activity) {
      const backgroundUsage = data.activity.filter(a => a.isBackground);
      if (backgroundUsage.length > 5) {
        insights.push("Excessive background activity detected in a short window.");
        riskScore += 30;
      }

      const unusualHours = data.activity.filter(a => {
        const hour = new Date(a.timestamp).getHours();
        return hour < 6 || hour > 22;
      });

      if (unusualHours.length > 2) {
        insights.push("Suspicious activity during off-peak hours detected.");
        riskScore += 20;
      }
    }

    if (data.events && data.events.length > 100) {
      insights.push("High volume of tracking events generated.");
      riskScore += 20;
    }

    if (data.deviceMemory && data.deviceMemory < 4 && data.events && data.events.length > 50) {
       insights.push("Aggressive data collection on a low-memory device.");
       riskScore += 15;
    }
    
    if (data.network === 'slow-2g' && data.events && data.events.length > 20) {
        insights.push("Unoptimized telemetry over a slow network connection, possibly exfiltration.");
        riskScore += 25;
    }

    riskScore = this.addRandomness(Math.min(100, riskScore));

    return {
      insights,
      riskScore,
      riskLevel: this.getRiskLevel(riskScore)
    };
  }
}