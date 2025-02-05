import dotenv from "dotenv"

dotenv.config()

export const env = {
  PORT: process.env.PORT || 3001,
  COOKIE_SECRET: process.env.COOKIE_SECRET || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  DB_URL: process.env.DB_URL || "",
}
