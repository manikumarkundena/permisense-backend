import { RiskLevel } from '../models/types.ts';

export interface SecurityEvent {
  time: string;
  event: string;
  risk: RiskLevel;
  details?: string;
}

class Logger {
  private logs: SecurityEvent[] = [];

  log(event: string, risk: RiskLevel, details?: string) {
    const entry: SecurityEvent = {
      time: new Date().toISOString(),
      event,
      risk,
      details
    };
    this.logs.unshift(entry);
    console.log(`[${entry.time}] [${entry.risk}] ${entry.event}: ${entry.details || ''}`);
    
    if (this.logs.length > 100) {
      this.logs.pop();
    }
  }

  getLogs(): SecurityEvent[] {
    return this.logs;
  }
}

export const securityLogger = new Logger();
