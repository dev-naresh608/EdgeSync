import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: z
    .string()
    .min(3, "Password must be at least 3 characters")
    .max(72, "Password must not exceed 72 characters"),

  region: z
    .enum(["india", "singapore", "germany"], {
      errorMap: () => ({ message: "Region must be india, singapore, or germany" }),
    }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});
