import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
// db
export const DB_URL = process.env.DB_URL;
export const DB_NAME = process.env.DB_NAME;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const REDIS_URL = process.env.REDIS_URL!;
// tokens
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
export const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES!;
export const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES!;

export const CORS_ORIGIN = process.env.CORS_ORIGIN!;
export const LOG_DIR = process.env.LOG_DIR!;
// Google Auth
export const APP_URL = process.env.APP_URL!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL!;
// SMTP
export const SMTP_HOST = process.env.SMTP_HOST!;
export const SMTP_USER = process.env.SMTP_USER!;
export const SMTP_PASS = process.env.SMTP_PASS!;
export const SMTP_SECURE = process.env.SMTP_SECURE!;
export const SMTP_PORT = process.env.SMTP_PORT!;
export const USE_STATIC_OTP = process.env.USE_STATIC_OTP!;
// #TWILIO
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
