import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
    try {
      const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/milestonemate', {
        serverSelectionTimeoutMS: 1500,
      });
      console.log(` MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch {
      console.log(`ℹ️ Local MongoDB daemon not detected. Operating seamlessly in resilient In-Memory Store mode.`);
      console.log(`💡 To connect to cloud MongoDB, set MONGODB_URI in server/.env (e.g., MongoDB Atlas mongodb+srv://...)`);
      return null;
    }
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`❌ MongoDB Connection Error: ${error.message}`);
    console.log(`ℹ️ Operating seamlessly in resilient In-Memory Store mode.`);
    return null;
  }
};

export default connectDB;
