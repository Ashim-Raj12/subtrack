import express from 'express';
import { getDashboardVideos } from '../controllers/videoController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();
router.use(requireAuth);

router.get('/dashboard', getDashboardVideos);

export default router;
