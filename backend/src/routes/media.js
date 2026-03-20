import { Router } from 'express';
import { getMedia, uploadMedia, deleteMedia } from '../controllers/mediaController.js';
import { authenticate, requireAdmin } from '../middlewares/auth.js';
import { uploadSingle } from '../middlewares/upload.js';

const router = Router();

router.get('/', authenticate, getMedia);
router.post('/upload', authenticate, requireAdmin, uploadSingle, uploadMedia);
router.delete('/:id', authenticate, requireAdmin, deleteMedia);

export default router;
