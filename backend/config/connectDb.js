import mongoose from "mongoose";
import dotenv from "dotenv"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Successfully Database Connected`);
  } catch (error) {
    console.error(`❌ Database Connection have some issue:`, error);
  }
};

export default connectDB;
