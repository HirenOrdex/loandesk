// src/repositories/userRepository.ts
import { Model, ObjectId, Types } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User, { IUser } from "../models/User";
import { UserDocument } from "../types/userType";
import redisClient from "../utils/redisClient";
import { hashToken } from "../utils/emailUtils";
import { logger } from "../configs/winstonConfig";
import { RoleModel } from "../models/RoleModel";

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
          "+password +refreshToken +passwordResetToken +passwordResetExpires +loginAttempts"
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
      const update: Partial<IUser> = {};
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
      await redisClient.set(`passwordReset:${userId}`, hashedToken, {
        EX: 10 * 60,
      });
      return resetToken;
    } catch (error) {
      logger.error(`createPasswordResetToken error: ${error}`);
      throw error;
    }
  }

  async findUserByResetToken(resetToken: string): Promise<IUser | null> {
    try {
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      const keys = await redisClient.keys("passwordReset:*");

      for (const key of keys) {
        const token = await redisClient.get(key);
        if (token === hashedToken) {
          const userId = key.split(":")[1];
          return await this.model.findById(userId);
        }
      }
      return null;
    } catch (error) {
      logger.error(`findUserByResetToken error: ${error}`);
      throw error;
    }
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      await this.model.findByIdAndUpdate(userId, {
        password: hashedPassword,
        loginAttempts: 0,
      });
      await redisClient.del(`passwordReset:${userId}`);
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
      await redisClient.set(`emailVerificationWeb:${userId}`, hashedToken, {
        EX: 24 * 60 * 60,
      });
      return await User.findById(userId);
    } catch (error) {
      logger.error(`updateEmailVerificationToken error: ${error}`);
      throw error;
    }
  }

  async findUserByEmailVerificationToken(
    token: string
  ): Promise<UserDocument | null> {
    try {
      const hashedToken = hashToken(token);
      const keys = await redisClient.keys("emailVerificationWeb:*");

      for (const key of keys) {
        const cachedToken = await redisClient.get(key);
        if (cachedToken === hashedToken) {
          const userId = key.split(":")[1];
          return await User.findById(userId);
        }
      }
      return null;
    } catch (error) {
      logger.error(`findUserByEmailVerificationToken error: ${error}`);
      throw error;
    }
  }

  async verifyEmail(userId: string): Promise<UserDocument | null> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isEmailVerified: true, status: "active" },
        { new: true }
      );

      if (!user) return null;

      await redisClient.del(`emailVerificationWeb:${userId}`);

      const { sendWelcomeEmail } = require("../../services/emailService");
      sendWelcomeEmail(user.email, user.firstName).catch((err: any) => {
        logger.error(`Failed to send welcome email to ${user.email}: ${err}`);
      });

      return user;
    } catch (error) {
      logger.error(`verifyEmail error: ${error}`);
      throw error;
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
      const role = await RoleModel.findOne({ rolename: roleName }).lean();
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
      const role = await RoleModel.findById(roleId).lean();
      if (role) {
        return role.rolename;
      }
    } catch (error) {
      console.error(`Error finding role by ID: ${roleId}`, error);
      return `Error finding role by ID: ${roleId}`;
    }
  };
}
