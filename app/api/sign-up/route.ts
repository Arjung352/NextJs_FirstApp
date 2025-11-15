import dbConnect from "@/app/lib/dbConnection";
import UserModel from "@/app/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmails";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    console.log({ UserName: username, Email: email, password: password });

    // find wheather a user is already verified and exists
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // if a user is already verified and exists
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "UserName already registered",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // if a user is and exists but with the email id
    if (existingUserByEmail) {
      // if a user is and exists but with the email id and also verified
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        // else help user to reset the password and verify him
        const hashPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    }
    // if the user is not existed
    else {
      const hashPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        password: hashPassword,
        email,
        verifyCode,
        isVerifie: false,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessages: true,
        messages: [],
      });
      console.log(newUser);
      await newUser.save();
    }

    // send Verification Email
    const emailVerification = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailVerification.success) {
      return Response.json(
        {
          success: false,
          message: emailVerification.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully.Please verify email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("error registering user", error);
    return Response.json(
      {
        success: false,
        message: "error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
