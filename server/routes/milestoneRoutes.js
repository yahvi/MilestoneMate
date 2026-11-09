import express from 'express';
import {
  createMilestone,
  createBulkMilestones,
  getMilestonesByProject,
  getMilestoneById,
  updateMilestone,
  submitMilestone,
  approveMilestone,
  requestRevision,
} from '../controllers/milestoneController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/project/:projectId', createMilestone);
router.post('/project/:projectId/bulk', createBulkMilestones);
router.get('/project/:projectId', getMilestonesByProject);

router.route('/:id')
  .get(getMilestoneById)
  .put(updateMilestone);

router.post('/:id/submit', submitMilestone);
router.post('/:id/approve', approveMilestone);
router.post('/:id/request-revision', requestRevision);

export default router;
