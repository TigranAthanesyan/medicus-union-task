import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as unknown as { mongoose: MongooseCache }).mongoose;

if (!cached) {
  cached = (global as unknown as { mongoose: MongooseCache }).mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI!;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
