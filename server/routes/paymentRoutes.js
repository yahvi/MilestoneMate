import express from 'express';
import {
  createOrder,
  captureOrder,
  getPaymentHistory,
  getProjectPayments,
  handleWebhook,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public webhook endpoint for PayPal IPN/Webhooks
router.post('/webhook', handleWebhook);

// Protected payment endpoints
router.post('/create-order', protect, createOrder);
router.post('/capture-order', protect, captureOrder);
router.get('/history', protect, getPaymentHistory);
router.get('/project/:projectId', protect, getProjectPayments);

export default router;
