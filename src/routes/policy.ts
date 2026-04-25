import { Router } from 'express';
import multer from 'multer';
import axios from 'axios';
import * as cheerio from 'cheerio';

import { SecurityService } from '../services/security.ts';
import { FileParser } from '../utils/file_parser.ts';
import { securityLogger } from '../utils/logger.ts';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze-policy', upload.single('file'), async (req, res) => {
  try {
    let text = req.body.policy_text || '';

    // 🔥 FILE INPUT
    if (req.file) {
      text = await FileParser.extractText(req.file);
    }

    // 🔥 URL INPUT (NEW)
    else if (req.body.url) {
      try {
        const response = await axios.get(req.body.url, {
          timeout: 5000,
          headers: {
            "User-Agent": "Mozilla/5.0"
          }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Remove unnecessary elements
        $("script, style, noscript").remove();

        text = $("body").text().replace(/\s+/g, " ").trim();

      } catch (err) {
        return res.status(400).json({
          error: "Failed to fetch URL. Some websites block scraping. Try paste mode."
        });
      }
    }

    // ❌ NO INPUT
    if (!text) {
      return res.status(400).json({ error: 'No policy content provided' });
    }

    // 🔥 ANALYSIS PIPELINE (UNCHANGED)
    const result = await SecurityService.analyzePolicy(text);

    securityLogger.log(
      `Policy analysis executed. Risk: ${result.riskLevel}`,
      result.riskLevel
    );

    res.json(result);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;