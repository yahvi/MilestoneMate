import express from 'express';
import {
  generateMilestones,
  getProgressSummary,
  getNextTaskAdvice,
  getDelayAnalysis,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/generate-milestones', generateMilestones);
router.post('/progress-summary', getProgressSummary);
router.post('/next-task', getNextTaskAdvice);
router.post('/delay-analysis', getDelayAnalysis);

export default router;
