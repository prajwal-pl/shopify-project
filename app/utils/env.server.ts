/**
 * Environment Variable Validation
 *
 * Validates required environment variables on startup.
 * Prevents app from starting with missing configuration.
 */

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  SHOPIFY_API_KEY: z.string().min(1, "SHOPIFY_API_KEY is required"),
  SHOPIFY_API_SECRET: z.string().min(1, "SHOPIFY_API_SECRET is required"),
  SCOPES: z.string().min(1, "SCOPES is required"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  PORT: z.string().optional().default("3000"),
});

export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

export function validateEnv(): Env {
  if (validatedEnv) {
    return validatedEnv;
  }

  try {
    validatedEnv = envSchema.parse(process.env);
    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");

      console.error("❌ Environment validation failed:");
      console.error(missingVars);
      console.error("\nPlease check your .env file and ensure all required variables are set.");

      process.exit(1);
    }

    throw error;
  }
}

export function getEnv(): Env {
  if (!validatedEnv) {
    return validateEnv();
  }
  return validatedEnv;
}

if (typeof window === "undefined") {
  validateEnv();
}
