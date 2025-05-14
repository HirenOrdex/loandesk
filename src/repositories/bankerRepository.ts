import { Model } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User, { IUser } from "../models/User";
import { UserDocument } from "../types/userType";
import redisClient from "../utils/redisClient";
import { hashToken } from "../utils/emailUtils";
import { logger } from "../configs/winstonConfig";
import BankerRegistrationModel from "../models/BankerModel";
import UserModel from "../models/User";
import { use } from "passport";
import { AddressModel } from "../models/AddressModel";

export class BankerRepossitory {
  async createBanker(bankerData: any) {
    try {
      // Create a new user
      const newUser = await UserModel.create({
        firstName: bankerData.firstName,
        lastName: bankerData.lastName,
        email: bankerData.email,
        password: bankerData.password, // Ensure this is hashed before passing
        phone: bankerData.phone,
        roleId: bankerData.roleId,
        status: "active",
        loginAttempts: 0,
      });

      // Create address if present
      let newAddress = null;

      if (bankerData.address) {
        const addressInput = Array.isArray(bankerData.address)
          ? bankerData.address[0]
          : bankerData.address;

        if (addressInput) {
          const addressWithCreator = {
            ...addressInput,
            createdBy: newUser._id,
          };
          newAddress = await AddressModel.create(addressWithCreator);
        }
      }

      console.log("New Address ID:", newAddress?._id);

      // Create the banker record
      const newBanker = await BankerRegistrationModel.create({
        userId: newUser._id,
        addressId: newAddress?._id,
        financialInstitutionName: bankerData?.financialInstitutionName,
        title: bankerData?.title,
        areaOfSpecialty: bankerData?.areaOfSpecialty,
        bankType: bankerData?.bankType,
        assetSize: bankerData?.assetSize,
        createdBy: newUser?._id,
      });

      return { newUser, newBanker, newAddress };
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Error creating banker: ${err.message}`);
      logger.error(`Error creating banker: ${err.message}`);
      throw new Error(`Error creating banker: ${err.message}`);
    }
  }

  async updateBanker(userId: string, updateData: any) {
    try {
      const userData = {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        email: updateData.email,
        password: updateData.password, // Don't forget to hash the password before saving in real use!
        phone: updateData.phone,
        role: "user", // Default role, can be changed based on your requirements
        status: "active", // Or another status based on your app logic
        loginAttempts: 0,
      };
      const updateBanker = {
        financialInstitutionName: updateData.financialInstitutionName,
        title: updateData.title,
        areaOfSpecialty: updateData.areaOfSpecialty,
        address: updateData.address,
        bankType: updateData.bankType,
        assetSize: updateData.assetSize,
      };

      const updateUser = await User.findByIdAndUpdate(userId, userData);
      const updatedBanker = await BankerRegistrationModel.findByIdAndUpdate(
        userId,
        updateBanker
      );

      if (!updatedBanker) {
        throw new Error("Banker not found");
      }

      return { id: updatedBanker._id };
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Error updating banker: ${err.message}`);
      logger.error(`Error updating banker: ${err.message}`);
      throw new Error(`Error updating banker: ${err.message}`);
    }
  }

  async hashPassword(password: string) {
    try {
      return await bcrypt.hash(password, 12);
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Error hashing password: ${err.message}`);
      logger.error(`Error hashing password: ${err.message}`);
      throw new Error(`Error hashing password: ${err.message}`);
    }
  }

  async getAllBankers() {
    try {
      const bankers = await BankerRegistrationModel.find().populate("userId");
      return bankers;
    } catch (error) {
      const err = error as Error;
      console.error(`Error fetching all bankers: ${err.message}`);
      throw new Error(`Error fetching all bankers: ${err.message}`);
    }
  }
  async getBankerById(bankerId: string) {
    try {
      const banker = await BankerRegistrationModel.findById(bankerId).populate(
        "userId"
      );

      if (!banker) {
        throw new Error("Banker not found");
      }

      return banker;
    } catch (error) {
      const err = error as Error;
      console.error(`Error fetching banker by ID: ${err.message}`);
      throw new Error(`Error fetching banker by ID: ${err.message}`);
    }
  }
}
