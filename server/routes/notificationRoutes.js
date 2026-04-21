import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);

export default router;
