import crypto from "crypto";
import { NODE_ENV, USE_STATIC_OTP } from "../configs/envConfigs";
import { logger } from "../configs/winstonConfig";
import { IError } from "../types/errorType";

/**
 * Generates a 6-digit OTP
 * @returns A 6-digit OTP as string
 */
export const generateOTP = async (phoneNumber: string): Promise<string> => {
  try {
    // For development purposes, use a static OTP (1234)
    if (NODE_ENV === "development" && USE_STATIC_OTP === "true") {
      return "1234";
    }

    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP via SMS using Twilio
    // await sendOtpViaSms(phoneNumber, otp);

    return otp;
  } catch (err: unknown) {
    const error = err as IError;
    logger.error(`Error generating OTP: ${error.message}`);
    throw new Error(`Error generating OTP: ${error.message}`);
  }
};

/**
 * Verifies if the provided OTP matches the stored OTP
 * @param inputOtp The OTP provided by the user
 * @param storedOtp The OTP stored in the system
 * @returns Boolean indicating if OTPs match
 */
export const verifyOTP = (inputOtp: string, storedOtp: string): boolean => {
  try {
    return inputOtp === storedOtp;
  } catch (err: unknown) {
    const error = err as IError;
    logger.error(`Error verifying OTP: ${error.message}`);
    throw new Error(`Error verifying OTP: ${error.message}`);
  }
};

/**
 * Hashes an OTP for secure storage
 * @param otp The plain text OTP
 * @returns Hashed OTP
 */
export const hashOTP = (otp: string): string => {
  try {
    return crypto.createHash("sha256").update(otp).digest("hex");
  } catch (err: unknown) {
    const error = err as IError;
    logger.error(`Error hashing OTP: ${error.message}`);
    throw new Error(`Error hashing OTP: ${error.message}`);
  }
};
