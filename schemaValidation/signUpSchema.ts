import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(3, { message: "Username should be at least 3 characters long" })
  .max(10, { message: "Username should not exceed 10 characters" })
  .regex(/^[A-Za-z0-9 _-]+$/, {
    message:
      "Username must not contain special characters other than '-' or '_'",
  });

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters long" }),
});
