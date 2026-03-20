import { Router } from 'express';
import { getTags, getTag, createTag, updateTag, deleteTag } from '../controllers/tagController.js';
import { authenticate, requireAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, getTags);
router.get('/:id', authenticate, getTag);
router.post('/', authenticate, requireAdmin, createTag);
router.put('/:id', authenticate, requireAdmin, updateTag);
router.delete('/:id', authenticate, requireAdmin, deleteTag);

export default router;
