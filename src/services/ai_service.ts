import { RiskLevel } from '../models/types.ts';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// 🔥 TEXT PREPROCESSING (IMPORTANT)
function preprocess(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n/g, ' ')
    .trim()
    .slice(0, 10000); // ✅ sweet spot for consistency + performance
}

export class AIService {

  // 🔥 POLICY ANALYSIS
  static async analyzePolicyWithAI(text: string, ruleResult: any) {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found. Using fallback.");
      return this.getPolicyFallback(ruleResult.riskLevel);
    }

    try {
      const cleanText = preprocess(text);

      const prompt = `
You are an advanced Cybersecurity & Privacy Risk Analyst.

Your job is to analyze privacy policies like a professional security auditor.

---------------------------------
CONTEXT
---------------------------------
Rule Engine Output:
- Risk Score: ${ruleResult.riskScore}/100
- Risk Level: ${ruleResult.riskLevel}

---------------------------------
TASK
---------------------------------
Analyze the privacy policy and identify REAL security risks.

Focus ONLY on:
- Third-party data sharing
- Data retention practices
- Sensitive data usage (location, biometrics, contacts, etc.)
- Hidden or vague legal language

Ignore:
- navigation text
- formatting noise
- irrelevant legal boilerplate

Ensure your analysis logically aligns with the provided risk score and risk level.

---------------------------------
INPUT TEXT
---------------------------------
${cleanText}

---------------------------------
STRICT OUTPUT FORMAT (JSON ONLY)
---------------------------------
{
  "summary": "A sharp, expert-level risk summary (1–2 lines)",
  "highlightedRisks": [
    "Specific real-world risk 1",
    "Specific real-world risk 2"
  ],
  "categories": {
    "sharing": "Clear insight about data sharing risk",
    "retention": "Insight about retention (mention duration if present)",
    "sensitiveUsage": "Insight about sensitive data usage"
  },
  "recommendation": "Actionable user advice (clear and practical)"
}

---------------------------------
CRITICAL RULES
---------------------------------
- Be precise and non-generic
- Sound like a cybersecurity auditor
- Keep outputs consistent for similar inputs
- Do NOT hallucinate
- Do NOT exaggerate beyond given text
`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction:
            "You are a strict cybersecurity auditor AI. Provide precise, consistent, and structured risk analysis.",
          responseMimeType: "application/json",
          temperature: 0.2 // 🔥 ensures consistency
        }
      });

      const jsonText = response.text || "{}";

      // ✅ SAFE PARSE (IMPORTANT)
      try {
        return JSON.parse(jsonText);
      } catch {
        console.warn("AI returned invalid JSON, using fallback.");
        return this.getPolicyFallback(ruleResult.riskLevel);
      }

    } catch (error) {
      console.error("Gemini AI Policy Analysis failed:", error);
      return this.getPolicyFallback(ruleResult.riskLevel);
    }
  }

  // 🔥 PERMISSION EXPLANATION
  static async explainPermissionsWithAI(appName: string, permissions: string[], ruleResult: any) {
    if (!process.env.GEMINI_API_KEY) {
      return this.getFallbackExplanation(ruleResult.riskLevel);
    }

    try {
      const prompt = `
Explain why the application "${appName}" requesting permissions [${permissions.join(', ')}] might be risky.

Backend Risk Score: ${ruleResult.riskScore}
Risk Level: ${ruleResult.riskLevel}

Give:
- Simple explanation
- Real-world risk implication
- Clear recommendation
`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          temperature: 0.2
        }
      });

      return response.text || this.getFallbackExplanation(ruleResult.riskLevel);

    } catch (error) {
      console.error("Gemini AI Permission Explanation failed:", error);
      return this.getFallbackExplanation(ruleResult.riskLevel);
    }
  }

  // 🔥 FALLBACK POLICY
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

  // 🔥 FALLBACK TEXT
  static getFallbackExplanation(riskLevel: RiskLevel) {
    const fallbacks = {
      [RiskLevel.CRITICAL]: "CRITICAL: High probability of sensitive data misuse detected.",
      [RiskLevel.HIGH]: "HIGH RISK: Multiple privacy concerns detected.",
      [RiskLevel.MEDIUM]: "MEDIUM RISK: Some data-sharing or retention concerns present.",
      [RiskLevel.LOW]: "LOW RISK: No major threats detected."
    };
    return fallbacks[riskLevel] || "Analysis complete.";
  }
}