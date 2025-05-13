import crypto from "crypto";
import redisClient from "../utils/redisClient";
import { logger } from "../configs/winstonConfig";

interface OTPData {
  phone: string;
  otp: string;
  userId?: string;
  email: string;
  type: "login" | "registration" | "reset_password" | "phone_change";
  createdAt: number;
  attempts: number;
}

class OTPRepository {
  async storeOTP(
    phone: string,
    otp: string,
    userId: string,
    email: string,
    type: OTPData["type"]
  ): Promise<string> {
    try {
      const otpData: OTPData = {
        phone,
        otp,
        userId,
        email,
        type,
        createdAt: Date.now(),
        attempts: 0,
      };

      await redisClient.set(`${type}_${email}`, JSON.stringify(otpData), {
        EX: 600,
      });
      return email;
    } catch (error) {
      logger.error(`Error in storeOTP: ${error}`);
      throw error;
    }
  }

  async getOTP(email: string, type: string): Promise<OTPData | null> {
    try {
      const key = `${type}_${email}`;
      console.log("Getting Redis key:", key);
      const otpData = await redisClient.get(key);
      if (!otpData) return null;
      const parsed = JSON.parse(otpData);
      console.log("Parsed OTP data:", parsed);
      return parsed;
    } catch (error) {
      logger.error(`Error in getOTP: ${error}`);
      throw error;
    }
  }

  async deleteOTP(email: string, type: string): Promise<void> {
    try {
      await redisClient.del(`${type}_${email}`);
    } catch (error) {
      logger.error(`Error in deleteOTP: ${error}`);
      throw error;
    }
  }

  async incrementAttempts(email: string, type: string): Promise<number> {
    try {
      const otpData = await this.getOTP(email, type);
      if (!otpData) throw new Error("OTP not found");

      otpData.attempts += 1;
      await redisClient.set(`${type}_${email}`, JSON.stringify(otpData), {
        EX: 300,
      });

      return otpData.attempts;
    } catch (error) {
      logger.error(`Error in incrementAttempts: ${error}`);
      throw error;
    }
  }

  async validateOTP(
    email: string,
    inputOtp: string,
    type: string
  ): Promise<boolean> {
    try {
      const otpData = await this.getOTP(email, type);
      if (!otpData) return false;

      const isExpired = Date.now() - otpData.createdAt > 5 * 60 * 1000;
      if (isExpired || otpData.attempts >= 3) {
        await this.deleteOTP(email, type);
        return false;
      }

      await this.incrementAttempts(email, type);
      return otpData.otp === inputOtp;
    } catch (error) {
      logger.error(`Error in validateOTP: ${error}`);
      throw error;
    }
  }
}

export default new OTPRepository();
