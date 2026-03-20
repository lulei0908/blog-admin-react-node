import { Router } from 'express';
import { getDashboard } from '../controllers/statsController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/dashboard', authenticate, getDashboard);

export default router;
