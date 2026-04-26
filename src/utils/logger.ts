import { RiskLevel, SecurityEvent } from '../models/types.ts';

class Logger {
  private logs: SecurityEvent[] = [];

  log(event: string, risk: RiskLevel, source: 'AI' | 'TELEMETRY' | 'SIMULATION' | 'SYSTEM' = 'SYSTEM', details?: string) {
    const entry: SecurityEvent = {
      time: new Date().toISOString(),
      event,
      risk,
      source,
      details
    };
    this.logs.unshift(entry);
    console.log(`[${entry.time}] [${source}] [${entry.risk}] ${entry.event}: ${entry.details || ''}`);
    
    if (this.logs.length > 100) {
      this.logs.pop();
    }
  }

  getLogs(): SecurityEvent[] {
    return this.logs;
  }
}

export const securityLogger = new Logger();
