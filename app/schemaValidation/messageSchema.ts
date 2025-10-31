import { z } from "zod";

export const messagesSchemaValidation = z.object({
  message: z
    .string()
    .min(10, { message: "content must of 10 character" })
    .max(300, { message: "content must not be longer than 300 characters" }),
});
