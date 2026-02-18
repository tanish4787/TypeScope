import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) {
    console.warn(
      "[db] MONGODB_URI not set. Running without database persistence."
    );
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log("[db] MongoDB connected");
    return true;
  } catch (error) {
    console.warn("[db] MongoDB connection failed. Running in stateless mode.");
    console.warn(error.message);
    return false;
  }
}
