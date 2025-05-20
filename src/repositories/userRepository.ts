// src/repositories/userRepository.ts
import { Model, ObjectId, Types } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User, { IUser } from "../models/User";
import { UserDocument } from "../types/userType";
import { nodeCacheClient } from "../utils/nodeCacheClient";
import { hashToken } from "../utils/emailUtils";
import { logger } from "../configs/winstonConfig";
import { RoleModel } from "../models/RoleModel";
import { sendWelcomeEmail } from "../services/emailService";

export class UserRepository {
  private model: Model<UserDocument>;

  constructor() {
    this.model = User;
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.model
        .findOne({ email })
        .select(
          "+password +refreshToken +passwordResetToken +passwordResetExpires +loginAttempts +otp"
        );
    } catch (error) {
      logger.error(`findUserByEmail error: ${error}`);
      throw error;
    }
  }

  async findById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id).lean();
    } catch (error) {
      logger.error(`findById error: ${error}`);
      throw error;
    }
  }

  async findByIds(ids: string[]): Promise<IUser[]> {
    try {
      return await User.find({ _id: { $in: ids } }).lean();
    } catch (error) {
      logger.error(`findByIds error: ${error}`);
      throw error;
    }
  }

  async findUserById(id: string): Promise<IUser | null> {
    try {
      
      return await this.model.findById(id).select("+refreshToken");
    } catch (error) {
      logger.error(`findUserById error: ${error}`);
      throw error;
    }
  }

  async createUser(
    userData: Pick<
      IUser,
      | "firstName"
      | "lastName"
      | "email"
      | "password"
      | "roleId"
      | "active"
      | "loginAttempts"
    >
  ): Promise<IUser> {
    try {
      if (!userData.password) throw new Error("Password is required");
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      return await this.model.create({ ...userData, password: hashedPassword });
    } catch (error) {
      logger.error(`createUser error: ${error}`);
      throw error;
    }
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null
  ): Promise<void> {
    try {
      const update: Partial<IUser> = { lastLoginAttempt: new Date() };
      if (refreshToken === null) {
        update.refreshToken = undefined;
      } else {
        update.refreshToken = await bcrypt.hash(refreshToken, 8);
      }
      await this.model.findByIdAndUpdate(userId, update);
    } catch (error) {
      logger.error(`updateRefreshToken error: ${error}`);
      throw error;
    }
  }

  async isAccountLocked(user: IUser): Promise<boolean> {
    try {
      const MAX_LOGIN_ATTEMPTS = 5;
      return user.loginAttempts >= MAX_LOGIN_ATTEMPTS;
    } catch (error) {
      logger.error(`isAccountLocked error: ${error}`);
      throw error;
    }
  }

  async incrementLoginAttempts(userId: string): Promise<void> {
    try {
      await this.model.findByIdAndUpdate(userId, {
        $inc: { loginAttempts: 1 },
      });
    } catch (error) {
      logger.error(`incrementLoginAttempts error: ${error}`);
      throw error;
    }
  }

  async resetLoginAttempts(userId: string): Promise<void> {
    try {
      await this.model.findByIdAndUpdate(userId, { loginAttempts: 0 });
    } catch (error) {
      logger.error(`resetLoginAttempts error: ${error}`);
      throw error;
    }
  }

  async createPasswordResetToken(userId: string): Promise<string> {
    try {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      const cacheKey = `passwordReset:${userId}`;
      nodeCacheClient.set(`passwordReset:${userId}`, hashedToken, 600); // ✅ Hashed

      // Update the global list of password reset keys
      const existingKeys =
        nodeCacheClient.get<string[]>("passwordResetKeys") || [];
      if (!existingKeys.includes(cacheKey)) {
        existingKeys.push(cacheKey);
        nodeCacheClient.set("passwordResetKeys", existingKeys, 600); // Match the TTL with token
      }

      console.log(
        `[createPasswordResetToken] Stored hashed token for key: ${cacheKey}`
      );
      console.log(
        `[createPasswordResetToken] Updated passwordResetKeys:`,
        existingKeys
      );

      return resetToken; // Email this to the user
    } catch (error) {
      logger.error(`createPasswordResetToken error: ${error}`);
      throw error;
    }
  }

  async findUserByResetToken(resetToken: string): Promise<IUser | null> {
    try {
      console.log("[findUserByResetToken] Received resetToken:", resetToken);

      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      console.log("[findUserByResetToken] Hashed token:", hashedToken);

      // Retrieve the list of password reset keys from cache
      const keys = nodeCacheClient.get<string[]>("passwordResetKeys") || [];
      console.log("[findUserByResetToken] Retrieved passwordResetKeys:", keys);

      // Iterate through each key to find the hashed token
      for (const key of keys) {
        const token = nodeCacheClient.get<string>(key);
        console.log(
          `[findUserByResetToken] Checking key: ${key} with token:`,
          token
        );

        if (token === hashedToken) {
          const userId = key.split(":")[1]; // Assuming key format is passwordReset:{userId}
          console.log(`[findUserByResetToken] Match found! UserId: ${userId}`);

          const user = await this.model.findById(userId);
          console.log(
            `[findUserByResetToken] User found for userId ${userId}:`,
            user
          );
          return user;
        }
      }

      console.log(
        "[findUserByResetToken] No matching reset token found in cache."
      );
      return null;
    } catch (error) {
      logger.error(`[findUserByResetToken] Error: ${error}`);
      throw error;
    }
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      await this.model.findByIdAndUpdate(userId, {
        password: hashedPassword,
        loginAttempts: 0,
        passwordChangedAt: new Date(),
        updatedBy: userId,
      });
      nodeCacheClient.del(`passwordReset:${userId}`);
    } catch (error) {
      logger.error(`updatePassword error: ${error}`);
      throw error;
    }
  }

  async updateEmailVerificationToken(
    userId: string,
    token: string
  ): Promise<UserDocument | null> {
    try {
      const hashedToken = hashToken(token);
      const cacheKey = `emailVerificationWeb:${userId}`;

      // Store hashed token in cache
      nodeCacheClient.set(cacheKey, hashedToken, 86400); // 24 hours

      // Track the key in the list
      const existingKeys =
        nodeCacheClient.get<string[]>("emailVerificationKeys") || [];
      if (!existingKeys.includes(cacheKey)) {
        existingKeys.push(cacheKey);
        nodeCacheClient.set("emailVerificationKeys", existingKeys, 86400);
      }

      console.log(`[updateEmailVerificationToken] Stored token at ${cacheKey}`);
      console.log(`[updateEmailVerificationToken] Keys list:`, existingKeys);

      return await User.findById(userId);
    } catch (error) {
      logger.error(`updateEmailVerificationToken error: ${error}`);
      throw error;
    }
  }

  async findUserByEmailVerificationToken(token: string): Promise<IUser | null> {
    try {
      const hashedToken = hashToken(token);

      // Retrieve the list of email verification keys
      const keys = nodeCacheClient.get<string[]>("emailVerificationKeys") || [];

      // Iterate through each key and check if the cached token matches
      for (const key of keys) {
        const cachedToken = nodeCacheClient.get(key);
        if (cachedToken === hashedToken) {
          const userId = key.split(":")[1]; // Assuming key format is emailVerificationWeb:{userId}
          return await User.findById(userId); // Fetch user by ID
        }
      }

      return null; // Return null if no user is found
    } catch (error) {
      logger.error(`findUserByEmailVerificationToken error: ${error}`);
      throw error;
    }
  }

  // Function to verify the email address
  async verifyEmail(userId: string): Promise<IUser | null> {
    try {
      // Update the user's email verification status
      const user = await User.findByIdAndUpdate(
        userId,
        { isEmailVerified: true, status: "active" },
        { new: true }
      );

      if (!user) return null;

      // Delete the email verification token from cache
      await nodeCacheClient.del(`emailVerificationWeb:${userId}`);

      // Remove the key from the list of email verification keys
      const emailVerificationKeys =
        (await nodeCacheClient.get<string[]>("emailVerificationKeys")) || [];
      const updatedKeys = emailVerificationKeys.filter(
        (key) => key !== `emailVerificationWeb:${userId}`
      );
      await nodeCacheClient.set("emailVerificationKeys", updatedKeys, 300); // TTL for 5 minutes

      // Send welcome email
      sendWelcomeEmail(user.email, user.firstName).catch((err: any) => {
        logger.error(`Failed to send welcome email to ${user.email}: ${err}`);
      });

      return user;
    } catch (error) {
      logger.error(`verifyEmail error: ${error}`);
      throw error;
    }
  }
  async isEmailAlreadyVerified(userId: string): Promise<boolean> {
    try {
      const user = await User.findById(userId, "isEmailVerified");
      if (!user) {
        throw new Error("User not found");
      }

      return user.isEmailVerified === true;
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Error checking email verification status: ${err.message}`);
      throw new Error(
        `Error checking email verification status: ${err.message}`
      );
    }
  }
  async findAll(): Promise<IUser[]> {
    try {
      return await User.find().select("_id");
    } catch (error) {
      logger.error(`findAll error: ${error}`);
      throw error;
    }
  }
  findRoleIdByName = async (roleName: string): Promise<any> => {
    try {
      const role = await RoleModel.findOne({ roleName: roleName }).lean();
      if (role?._id) {
        return role?._id;
      } else {
        return `Error finding role by name`;
      }
    } catch (error) {
      console.error(`Error finding role by name: ${roleName}`, error);
      return `Error finding role by name in db`;
    }
  };
  findRoleIdById = async (roleId: string | Types.ObjectId): Promise<any> => {
    try {
      console.log("role",roleId)
      const role = await RoleModel.findById(roleId).lean();
      if (role) {
        return role.roleName;
      }
    } catch (error) {
      console.error(`Error finding role by ID: ${roleId}`, error);
      return `Error finding role by ID: ${roleId}`;
    }
  };
}
