import mongoose from 'mongoose';

export async function connectDb() {
  try {
    // Check if already connected
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.DB_NAME,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Unable to connect to MongoDB -> ERROR: ', error);
    throw error;
  }
}
