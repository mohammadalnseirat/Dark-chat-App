import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const connecting = await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB : ", connecting.connection.host);
  } catch (error) {
    console.log("Error connecting to database", error.message);
    process.exit(1);
  }
};

export default connectToDatabase;
