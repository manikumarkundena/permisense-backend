export const config = {
  appName: 'PermiSense AI',
  version: '1.0.4',
  port: process.env.PORT || 3001,
  geminiModel: 'gemini-3-flash-preview',
  riskThresholds: {
    critical: 85,
    high: 65,
    medium: 35
  }
};
