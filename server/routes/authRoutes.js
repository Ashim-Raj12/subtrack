import express from 'express';
import { googleAuth, updateSettings } from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/google', googleAuth);
router.put('/settings', requireAuth, updateSettings);

export default router;
