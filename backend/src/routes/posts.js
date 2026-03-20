import { Router } from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost, toggleSticky } from '../controllers/postController.js';
import { authenticate, requireAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, getPosts);
router.get('/:id', authenticate, getPost);
router.post('/', authenticate, requireAdmin, createPost);
router.put('/:id', authenticate, requireAdmin, updatePost);
router.delete('/:id', authenticate, requireAdmin, deletePost);
router.put('/:id/sticky', authenticate, requireAdmin, toggleSticky);

export default router;
