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
  details?: string;
}

export interface BehaviorData {
  appId: string;
  activity: {
    type: string;
    timestamp: string;
    resource: string;
    isBackground: boolean;
  }[];
}
