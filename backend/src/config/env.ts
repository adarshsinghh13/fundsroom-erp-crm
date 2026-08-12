import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment variable ${key} is required.`);
  }

  return value;
}

export const env = {
  PORT: process.env.NODE_ENV === "production" ? Number(process.env.PORT) || 3000 : 3001,

  NODE_ENV: process.env.NODE_ENV || "development",

  get DATABASE_URL() {
    return getEnv("DATABASE_URL");
  },

  get JWT_SECRET() {
    return getEnv("JWT_SECRET");
  },

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
} as const;