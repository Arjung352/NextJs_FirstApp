import mongoose from "mongoose";

// typescript type for connection
type connectionObject = {
  isConnected?: number;
};

// holds connection status
const connection: connectionObject = {};

// fucntion to connect to the db
async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.log("DB connection failed", error);
    process.exit(1);
  }
}
export default dbConnect;
