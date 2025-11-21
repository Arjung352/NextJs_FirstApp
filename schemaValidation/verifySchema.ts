import { z } from "zod";

export const verifySchemaValidation = z.object({
  code: z.string().length(6, "verification string must be of 6 digits"),
});
