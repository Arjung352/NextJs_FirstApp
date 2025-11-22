import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { Message } from "@/model/Message";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }
    if (user.isAcceptingMessages) {
      if (!user) {
        return Response.json(
          {
            success: false,
            message: "user not excepting the messages",
          },
          { status: 404 }
        );
      }
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Message send successfully",
      },
      { status: 200 }
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
