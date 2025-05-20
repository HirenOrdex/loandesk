import { Request, Response } from "express";
import { logger } from "../configs/winstonConfig";
import PersonModel from "../models/Person";
import UserModel from "../models/User";
import mongoose from "mongoose";
import { profileUpdateSchema } from "../validators/profileValidator";
import { ErrorResponse } from "../types/errorType";
import { PersonData } from "../types/personType";
import { AWS_S3_AVATAR_FOLDER } from "../configs/envConfigs";
import { uploadFileToS3 } from "../services/uploadFileToS3.service";
import { AddressModel } from "../models/AddressModel";

export const getProfileById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "User ID is required.",
        error: "Missing user ID in request.",
      });
    }

    // Convert userId string to ObjectId
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const pipeline = [
      { $match: { _id: objectUserId } },
      {
        $lookup: {
          from: "role",
          localField: "roleId",
          foreignField: "_id",
          as: "roleData",
        },
      },
      { $unwind: { path: "$roleData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "person",
          localField: "_id",
          foreignField: "userId",
          as: "personData",
        },
      },
      { $unwind: { path: "$personData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "address",
          localField: "personData.addressId",
          foreignField: "_id",
          as: "personAddressData",
        },
      },
      {
        $unwind: {
          path: "$personAddressData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "banker",
          localField: "_id",
          foreignField: "userId",
          as: "bankerData",
        },
      },
      { $unwind: { path: "$bankerData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "address",
          localField: "bankerData.addressId",
          foreignField: "_id",
          as: "bankerAddressData",
        },
      },
      {
        $unwind: {
          path: "$bankerAddressData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "borrower",
          localField: "_id",
          foreignField: "userId",
          as: "borrowerData",
        },
      },
      { $unwind: { path: "$borrowerData", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          email: 1,
          firstName: 1,
          middleInitial: 1,
          lastName: 1,
          phone: 1,
          workPhone: { $ifNull: ["$personData.workPhone", ""] },
          email2: { $ifNull: ["$personData.email2", ""] },
          webUrl: { $ifNull: ["$personData.webUrl", ""] },
          linkedinUrl: { $ifNull: ["$personData.linkedinUrl", ""] },
          profileImage: { $ifNull: ["$personData.profileImage", ""] },
          role: "$roleData.name",
          userAddress: ["$personAddressData"],
          financialInstitutionName: "$bankerData.financialInstitutionName",
          title: "$bankerData.title",
          areaOfSpecialty: "$bankerData.areaOfSpecialty",
          fInsAddress: ["$bankerAddressData"],
          bankType: "$bankerData.bankType",
          assetSize: "$bankerData.assetSize",
          coname: "$borrowerData.coname",
          position: "$borrowerData.position",
          other_position: "$borrowerData.other_position",
        },
      },
    ];

    // Assuming you have a UserModel representing your users collection
    const [profileData] = await UserModel.aggregate(pipeline);

    if (!profileData) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "User profile not found.",
        error: "No user with that ID",
      });
    }

    return res.status(200).json({
      success: true,
      data: profileData,
      message: "Profile retrieved successfully.",
      error: null,
    });
  } catch (error: any) {
    logger.error(
      `Error retrieving profile by ID with pipeline: ${error.message}`
    );
   return res.status(500).json({
      success: false,
      data: null,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateProfileById = async (req: Request, res: Response): Promise<any> => {
  const userId = req.params.id;

  if (!userId) {
    logger.warn("User ID is missing in request");
    return res.status(400).json({
      success: false,
      data: null,
      message: "User ID is required",
    });
  }

  const objectUserId = new mongoose.Types.ObjectId(userId);
  let personData: PersonData;

  try {
    personData =
      typeof req.body.personData === "string"
        ? JSON.parse(req.body.personData)
        : req.body;
  } catch (e: any) {
    logger.warn("Failed to parse personData JSON: " + e.message);
    return res.status(400).json({
      success: false,
      data: null,
      message: "Invalid JSON format in personData",
      error: e.message,
    });
  }

  const {
    firstName,
    middleInitial,
    lastName,
    email,
    phone,
    workPhone,
    email2,
    linkedinUrl,
    webUrl,
    suiteNo,
    address,
  } = personData;

  try {
    // Upload profile image if provided
    let profileImage: string | null = null;
    if (req.file) {
      const result = await uploadFileToS3(req.file.originalname, req.file.buffer, AWS_S3_AVATAR_FOLDER);
      profileImage = result.Location;
      logger.info(`userId: ${userId} Profile image uploaded: ${profileImage}`);
    }

    const user = await UserModel.findById(objectUserId);
    if (!user) {
      logger.warn("User not found during profile update");
      return res.status(404).json({ success: false, data: null, message: "User not found" });
    }

    // Update user basic fields if changed
    let userModified = false;
    const userFields: Partial<typeof user> = { firstName, middleInitial, lastName, email, phone };

    for (const [key, value] of Object.entries(userFields)) {
      if (value && value !== (user as any)[key]) {
        (user as any)[key] = value;
        userModified = true;
      }
    }

    if (userModified) await user.save();

    // Handle address logic
    let addressId = null;
    const addressInput = Array.isArray(address) ? address[0] : address;

    if (addressInput) {
      const existingPerson = await PersonModel.findOne({ userId: objectUserId });
      const existingAddress = existingPerson?.addressId
        ? await AddressModel.findById(existingPerson.addressId)
        : null;

      if (!existingAddress || existingAddress.fullAddress !== addressInput.fullAddress) {
        const newAddress = await AddressModel.create({ ...addressInput });
        addressId = newAddress._id;
        logger.info(`userId: ${userId} New address created with ID: ${newAddress._id}`);
      } else {
        addressId = existingAddress._id;
      }
    }

    // Prepare update payload
    const personUpdate: Record<string, any> = {
      updatedBy: userId,
      ...(workPhone && { workPhone }),
      ...(email2 && { email2 }),
      ...(suiteNo && { suiteNo }),
      ...(webUrl && { webUrl }),
      ...(linkedinUrl && { linkedinUrl }),
      ...(addressId ? { addressId } : {}),
      ...(profileImage && { profileImage }),
    };

    // Create or update person entry
    const person = await PersonModel.findOne({ userId: objectUserId });

    if (!person) {
      await PersonModel.create([
        {
          userId: objectUserId,
          createdBy: userId,
          updatedBy: userId,
          ...personUpdate,
        },
      ]);
      logger.info(`userId: ${userId} Created new person entry`);
    } else {
      await PersonModel.updateOne({ userId: objectUserId }, { $set: personUpdate });
      logger.info(`userId: ${userId} Updated person entry`);
    }

    //pipeline
    const pipeline = [
      { $match: { _id: objectUserId } },
      {
        $lookup: {
          from: "role",
          localField: "roleId",
          foreignField: "_id",
          as: "roleData",
        },
      },
      { $unwind: { path: "$roleData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "person",
          localField: "_id",
          foreignField: "userId",
          as: "personData",
        },
      },
      { $unwind: { path: "$personData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "address",
          localField: "personData.addressId",
          foreignField: "_id",
          as: "personAddressData",
        },
      },
      {
        $unwind: {
          path: "$personAddressData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "banker",
          localField: "_id",
          foreignField: "userId",
          as: "bankerData",
        },
      },
      { $unwind: { path: "$bankerData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "address",
          localField: "bankerData.addressId",
          foreignField: "_id",
          as: "bankerAddressData",
        },
      },
      {
        $unwind: {
          path: "$bankerAddressData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "borrower",
          localField: "_id",
          foreignField: "userId",
          as: "borrowerData",
        },
      },
      { $unwind: { path: "$borrowerData", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          email: 1,
          firstName: 1,
          middleName: 1,
          lastName: 1,
          phone: 1,
          workPhone: "$personData.workPhone",
          email2: "$personData.email2",
          suiteNo: "$personData.suiteNo",
          webUrl: "$personData.webUrl",
          profileImage: "$personData.profileImage",
          linkedinUrl: "$personData.linkedinUrl",
          role: "$roleData.name",
          userAddress: "$personAddressData",
          financialInstitutionName: "$bankerData.financialInstitutionName",
          title: "$bankerData.title",
          areaOfSpecialty: "$bankerData.areaOfSpecialty",
          fInsAddress: "$bankerAddressData",
          bankType: "$bankerData.bankType",
          assetSize: "$bankerData.assetSize",
          coname: "$borrowerData.coname",
          position: "$borrowerData.position",
          other_position: "$borrowerData.other_position",
        },
      },
    ];

    const [updatedProfile] = await UserModel.aggregate(pipeline);

    if (!updatedProfile) {
      logger.warn(
        `UserId: ${userId} No updated profile found after update for `
      );

      return res.status(404).json({
        success: false,
        data: null,
        message: "Updated profile not found.",
        error: "No user profile found after update",
      });
    }

    logger.info(`UserId: ${userId}: Profile updated successfully`);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        user,
        person: personUpdate,
      },
    });
  } catch (error: any) {
    logger.error(
      `UserId: ${req.params.id}: Error updating profile by ID: ${error.message}`
    );
    return res.status(500).json({
        success:false,
        data:null,
        message: "Internal Server Error",
        error: `error ${error.message}`
      })
  }
};
