import { Router } from 'express';
import multer from 'multer';
import { SecurityService } from '../services/security.ts';
import { FileParser } from '../utils/file_parser.ts';
import { securityLogger } from '../utils/logger.ts';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze-policy', upload.single('file'), async (req, res) => {
  try {
    let text = req.body.policy_text || '';
    if (req.file) {
      text = await FileParser.extractText(req.file);
    }

    if (!text && !req.body.url) {
      return res.status(400).json({ error: 'No policy content provided' });
    }

    const result = await SecurityService.analyzePolicy(text);
    securityLogger.log(`Policy analysis executed. Risk: ${result.riskLevel}`, result.riskLevel);
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
