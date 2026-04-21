import express from 'express';
import { getSubscriptions, syncSubscriptions } from '../controllers/subscriptionController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', getSubscriptions);
router.post('/sync', syncSubscriptions);

export default router;
