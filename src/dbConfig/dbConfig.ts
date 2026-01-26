import mongoose from 'mongoose';

// Global cache for serverless - prevents creating new connections on every invocation
declare global {
  var _mongooseConnection: typeof mongoose | undefined;
}

export async function connectDb() {
  // Return cached connection if available
  if (global._mongooseConnection && mongoose.connection.readyState >= 1) {
    return global._mongooseConnection;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.DB_NAME,
    });

    global._mongooseConnection = mongoose;
    console.log('MongoDB connected successfully');
    return mongoose;
  } catch (error) {
    console.error('Unable to connect to MongoDB -> ERROR: ', error);
    throw error;
  }
}
