import { NextResponse } from "next/server";
import dbConnect from "../../lib/dbConnection";

export async function GET() {
  await dbConnect();
  return NextResponse.json({ message: "Database connected successfully!" });
}
