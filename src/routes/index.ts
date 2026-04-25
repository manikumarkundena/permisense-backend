import { Router } from 'express';
import policyRouter from './policy.ts';
import permissionRouter from './permission.ts';
import monitorRouter from './monitor.ts';
import attackRouter from './attack.ts';

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

export default router;
