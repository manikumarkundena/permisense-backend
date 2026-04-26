import { Router } from 'express';
import { RiskLevel } from '../models/types.ts';

const router = Router();

const locations = ['New York', 'London', 'Tokyo', 'Singapore', 'Frankfurt', 'Sydney', 'San Francisco', 'São Paulo'];
const types = ['DDoS Attack', 'Phishing Campaign', 'Data Breach', 'Ransomware', 'Credential Stuffing', 'Zero-Day Exploit'];
const severities = [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL];

router.get('/threat-feed', (req, res) => {
  const eventsCount = Math.floor(Math.random() * 5) + 3; // 3 to 7 events
  const feed = [];

  for (let i = 0; i < eventsCount; i++) {
    feed.push({
      id: `threat-${Math.random().toString(36).substring(2, 9)}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString()
    });
  }

  // Sort by timestamp descending
  feed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.json(feed);
});

export default router;
