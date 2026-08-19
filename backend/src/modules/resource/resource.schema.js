import { z } from "zod";

export const resourceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(200, "Name must not exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must not exceed 1000 characters")
    .optional()
    .default(""),
});
