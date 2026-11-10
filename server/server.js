import app from './app.js';
import connectDB from './config/db.js';
import User from './models/User.js';
import { seedDatabase } from './utils/seedData.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
connectDB().then(async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 No users found, automatically seeding demo dataset...');
      await seedDatabase();
      console.log('✅ Demo dataset auto-seeded successfully!');
    }
  } catch (err) {
    console.warn('⚠️ Auto-seed check notice:', err.message);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MilestoneMate Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});
