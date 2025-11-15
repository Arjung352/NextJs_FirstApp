import mongoose, { Schema, Document } from "mongoose";
import { Message } from "./Message";

// defining the types for the schema
export interface User extends Document {
  username: string;
  password: string;
  email: string;
  verifyCode: string;
  isVerified: boolean;
  verifyCodeExpiry: Date;
  isAcceptingMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Please enter UserName"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter Email"],
    unique: true,
    match: [/.+\@.+\..+/, "please use a valid email format"],
  },
  password: {
    type: String,
    required: [true, "Please enter Password"],
  },
  verifyCode: {
    type: String,
    required: [true, "verifyCode is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verifyCodeExpiry is required"],
  },
  isAcceptingMessages: {
    type: Boolean,
    required: true,
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
