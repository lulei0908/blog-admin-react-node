import { Router } from 'express';
import { getComments, reviewComment, replyComment, deleteComment } from '../controllers/commentController.js';
import { authenticate, requireAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, getComments);
router.put('/:id/review', authenticate, requireAdmin, reviewComment);
router.post('/:id/reply', authenticate, requireAdmin, replyComment);
router.delete('/:id', authenticate, requireAdmin, deleteComment);

export default router;
