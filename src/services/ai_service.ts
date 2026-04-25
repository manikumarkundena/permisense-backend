import { RiskLevel } from '../models/types.ts';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export class AIService {
  static async analyzePolicyWithAI(text: string, ruleResult: any) {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found. Using fallback.");
      return this.getPolicyFallback(ruleResult.riskLevel);
    }

    try {
      const prompt = `
        As a Cyber Security Legal Expert, analyze this privacy policy text.
        The rule engine has already detected a risk score of ${ruleResult.riskScore}/100 (${ruleResult.riskLevel}).
        
        TEXT BLOB: ${text.substring(0, 4000)}
        
        Generate a JSON response with:
        {
          "summary": "concise risk summary",
          "highlightedRisks": ["key risk 1", "key risk 2"],
          "categories": {
            "sharing": "analysis of data sharing",
            "retention": "analysis of data retention",
            "sensitiveUsage": "analysis of sensitive usage"
          },
          "recommendation": "specific user action"
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are a specialized AI Cyber Security Analyst. Provide structured, technically accurate JSON output.",
          responseMimeType: "application/json",
        }
      });

      const jsonText = response.text || "{}";
      return JSON.parse(jsonText);
    } catch (error) {
      console.error("Gemini AI Policy Analysis failed:", error);
      return this.getPolicyFallback(ruleResult.riskLevel);
    }
  }

  static async explainPermissionsWithAI(appName: string, permissions: string[], ruleResult: any) {
    if (!process.env.GEMINI_API_KEY) {
      return this.getFallbackExplanation(ruleResult.riskLevel);
    }

    try {
      const prompt = `
        Explain why the application "${appName}" requesting permissions [${permissions.join(', ')}] might be risky.
        Backend Rule Score: ${ruleResult.riskScore}
        Backend Risk Level: ${ruleResult.riskLevel}
        
        Provide a simple human explanation and a clear security recommendation.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      return response.text || this.getFallbackExplanation(ruleResult.riskLevel);
    } catch (error) {
      console.error("Gemini AI Permission Explanation failed:", error);
      return this.getFallbackExplanation(ruleResult.riskLevel);
    }
  }

  private static getPolicyFallback(riskLevel: RiskLevel) {
    return {
      summary: this.getFallbackExplanation(riskLevel),
      highlightedRisks: ["Structural scan identified potential vulnerabilities."],
      categories: {
        sharing: "Manual verification required for third-party clauses.",
        retention: "Data retention period analysis inconclusive.",
        sensitiveUsage: "Verify sensitive data handling in settings."
      },
      recommendation: "Review the original document manually for better context."
    };
  }

  static getFallbackExplanation(riskLevel: RiskLevel) {
    const fallbacks = {
      [RiskLevel.CRITICAL]: "CRITICAL THREAT: System patterns suggest immediate data exfiltration risk. Manual intervention required.",
      [RiskLevel.HIGH]: "HIGH RISK: Unusual permission combination detected. Privacy leakage is probable.",
      [RiskLevel.MEDIUM]: "MEDIUM RISK: Data sharing clauses detected. Usage verification recommended.",
      [RiskLevel.LOW]: "System analysis suggests clear operations."
    };
    return fallbacks[riskLevel] || "Analysis complete.";
  }
}
