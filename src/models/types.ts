export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface AppPermission {
  name: string;
  permissions: string[];
  category: string;
}

export interface SecurityEvent {
  time: string;
  event: string;
  risk: RiskLevel;
  source: 'AI' | 'TELEMETRY' | 'SIMULATION' | 'SYSTEM';
  details?: string;
}

export interface BehaviorData {
  appId: string;
  activity?: {
    type: string;
    timestamp: string;
    resource: string;
    isBackground: boolean;
  }[];
  online?: boolean;
  network?: string;
  deviceMemory?: number;
  events?: string[];
}

export interface AdvancedPermissionRisk {
  riskScore: number;
  riskLevel: RiskLevel;
  confidence: number;
  reasons: string[];
  misuseScenarios: string[];
  saferAlternatives: string[];
}
