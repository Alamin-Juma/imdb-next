import mongoose from "mongoose";

let initialized = false;

export const connect = async (): Promise<void> => {
  mongoose.set("strictQuery", true);

  if (initialized) {
    console.log("MongoDB already connected");
    return;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Error: MONGODB_URI is not defined in the environment variables.");
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: "next-imdb-clerk", // Only valid properties should be used
    });
    initialized = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Optionally re-throw the error for handling upstream
  }
};
