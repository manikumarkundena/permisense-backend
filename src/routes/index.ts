import { Router } from 'express';
import policyRouter from './policy.ts';
import permissionRouter from './permission.ts';
import monitorRouter from './monitor.ts';
import attackRouter from './attack.ts';
import riskRouter from './risk.ts';
import threatsRouter from './threats.ts';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.send('PERMISENSE AI Backend Running');
});

// Mount Routes
router.use('/', policyRouter);
router.use('/', permissionRouter);
router.use('/', monitorRouter);
router.use('/', attackRouter);
router.use('/', riskRouter);
router.use('/', threatsRouter);

export default router;
