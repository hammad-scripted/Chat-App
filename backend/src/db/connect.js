import mongoose from 'mongoose';
export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    return connection;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
