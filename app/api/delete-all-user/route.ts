import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";

export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const result = await UserModel.deleteMany({});
    console.log(result);
    if (result.deletedCount > 0) {
      return Response.json(
        {
          success: true,
          message: "Deleted all username",
        },
        {
          status: 200,
        }
      );
    }
    return Response.json(
      {
        success: false,
        message: "error deleting all username",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error("error deleting user", error);
    return Response.json(
      {
        success: false,
        message: "error deleting user",
      },
      {
        status: 500,
      }
    );
  }
}
