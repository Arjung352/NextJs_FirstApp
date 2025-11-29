import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    // here we're finding the user and parallaly updating the acceptence prefrence and saving it
    const updatedUser = await UserModel.findById(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "message acceptance status succesfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update user status for accepting massages");
    return Response.json(
      {
        success: false,
        message: error,
      },
      { status: 500 }
    );
  }
}
export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  try {
    const userFound = await UserModel.findById(userId);
    if (!userFound) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Found User",
        isAcceptingMessage: userFound.isAcceptingMessages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to fetch user info");
    return Response.json(
      {
        success: false,
        message: error,
      },
      { status: 500 }
    );
  }
}
