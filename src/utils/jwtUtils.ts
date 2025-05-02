import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { redisClient } from "./redisClient";
import {
  ACCESS_TOKEN_EXPIRES,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES,
  REFRESH_TOKEN_SECRET,
} from "../configs/envConfigs";

// Cast these to the correct type to avoid the TS error
const ACCESS_TOKEN_EXPIRES_IN =
  (ACCESS_TOKEN_EXPIRES as SignOptions["expiresIn"]) || "1d";
const REFRESH_TOKEN_EXPIRES_IN =
  (REFRESH_TOKEN_EXPIRES as SignOptions["expiresIn"]) || "7d";

export interface JWTPayload {
  id: string;
  role?: string;
}

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as unknown as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as unknown as JWTPayload;
};

export const addTokenToBlacklist = async (
  token: string,
  expiresIn: string | number
): Promise<void> => {
  // Convert expiresIn to seconds if it's a string
  let expiry: number;
  if (typeof expiresIn === "string") {
    // Parse expiresIn string like '15m', '1h', '7d' to seconds
    const unit = expiresIn.charAt(expiresIn.length - 1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case "s":
        expiry = value;
        break;
      case "m":
        expiry = value * 60;
        break;
      case "h":
        expiry = value * 60 * 60;
        break;
      case "d":
        expiry = value * 24 * 60 * 60;
        break;
      default:
        expiry = 900; // Default 15 minutes
    }
  } else {
    expiry = expiresIn;
  }

  await redisClient.set(`bl_${token}`, "true", { EX: expiry });
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const result = await redisClient.get(`bl_${token}`);
  return result === "true";
};
