import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import milestoneRoutes from './routes/milestoneRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { seedDatabase } from './utils/seedData.js';

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'MilestoneMate API',
    aiEnabled: Boolean(process.env.GEMINI_API_KEY),
    paypalConfigured: Boolean(
      process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_ID !== 'YOUR_SANDBOX_CLIENT_ID'
    ),
  });
});

// Seed endpoint for instant demo testing
app.post('/api/seed', async (req, res, next) => {
  try {
    await seedDatabase();
    res.json({
      success: true,
      message: 'Demo dataset seeded successfully!',
      credentials: {
        freelancer: { email: 'alex@milestonemate.dev', password: 'password123' },
        client: { email: 'sarah@company.com', password: 'password123' },
      },
    });
  } catch (err) {
    next(err);
  }
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handler
app.use(errorHandler);

export default app;
