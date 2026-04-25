import { RiskLevel } from './types.ts';

export interface RiskResult {
  riskScore: number;
  riskLevel: RiskLevel;
  confidence: number;
  explanation: string;
  recommendation: string;
}

export interface PolicyAnalysisResponse extends RiskResult {
  summary: string;
  highlightedRisks: string[];
  categories: {
    sharing: string;
    retention: string;
    sensitiveUsage: string;
  };
}

export interface PermissionAnalysisResponse extends RiskResult {}

export interface BehaviorReport {
  insights: string[];
  updatedRisk: RiskLevel;
  explanation: string;
}
