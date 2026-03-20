import { Router } from 'express';
import { login, register, getMe, refreshToken, logout } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.post('/refresh', refreshToken);

export default router;
