// src/controllers/profileController.ts

import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import { BankerRepossitory } from "../repositories/bankerRepository";
import { BorrowerRepository } from "../repositories/borrowerRepository";
import { IUser } from "../types/userType";
import { IBankerRegistration } from "../models/BankerModel";

import { logger } from "../configs/winstonConfig";
import { AddressModel } from "../models/AddressModel";

const userRepository = new UserRepository();
const bankerRepository = new BankerRepossitory();
const borrowerRepository = new BorrowerRepository();


export const getProfileById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({
        success: false,
        data: null,
        message: "User ID is required.",
        error: "Missing user ID in request.",
      });
      return;
    }

    const user = await userRepository.findUserById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        data: null,
        message: "User not found.",
        error: "User does not exist.",
      });
      return;
    }

    if (!user.roleId) {
      throw new Error("User roleId is undefined");
    }

    const role = await userRepository.findRoleIdById(user.roleId.toString());

    let profileData: any = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: role,
    };

    if (role === "Banker") {
      const banker = await bankerRepository.findBankerByUserId(userId);
      console.log("banker",banker)
      if (banker) {
        const address = banker.addressId
          ? await AddressModel.findById(banker.addressId)
          : null;

        profileData = {
          ...profileData,
          financialInstitutionName: banker.financialInstitutionName,
          title: banker.title,
          areaOfSpecialty: banker.areaOfSpecialty,
          bankType: banker.bankType,
          assetSize: banker.assetSize,
          address: address,
        };
      }
    } else if (role === "Borrower") {
      const borrower = await borrowerRepository.findBorrowerByUserId(userId);

      if (borrower) {
        // const address = borrower.addressId
        //   ? await AddressModel.findById(borrower.addressId)
        //   : null;

        profileData = {
          ...profileData,
          coname: borrower.coname,
          position: borrower.position,
          other_position: borrower.other_position,
        //   address: address,
        };
      }
    }

    res.status(200).json({
      success: true,
      data: profileData,
      message: "Profile retrieved successfully.",
      error: null,
    });
  } catch (error: any) {
    logger.error(`Error retrieving profile by ID: ${error.message}`);
    res.status(500).json({
      success: false,
      data: null,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};