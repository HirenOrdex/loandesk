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
          middleName: 1,
          lastName: 1,
          phone: 1,
          workPhone: "$personData.workPhone",
          email2: "$personData.email2",
          webUrl: "$personData.webUrl",
          linkedinURL: "$personData.linkedinURL",
          profileImage: "$personData.profileImage",
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

    res.status(200).json({
      success: true,
      data: profileData,
      message: "Profile retrieved successfully.",
      error: null,
    });
  } catch (error: any) {
    logger.error(
      `Error retrieving profile by ID with pipeline: ${error.message}`
    );
    res.status(500).json({
      success: false,
      data: null,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateProfileById = async (
  req: Request,
  res: Response
): Promise<any> => {
  let dataToValidate: { personData?: PersonData } = { ...req.body };

  if (typeof req.body.personData === "string") {
    try {
      dataToValidate.personData = JSON.parse(req.body.personData);
    } catch (e: any) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "Invalid JSON format in personData",
        statusCode: 400,
        details: [e.message],
      };
      logger.warn("Failed to parse personData JSON: " + e.message);
     return res.status(errorResponse.statusCode).json(errorResponse);

    }
  }

  // Validate the parsed data
  const { error } = profileUpdateSchema.validate(dataToValidate, {
    abortEarly: false,
  });
  if (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "Validation failed",
      statusCode: 400,
      details: error.details.map((d) => d.message),
    };
    logger.warn("Validation failed for profile update", {
      details: errorResponse.details,
    });

    return res.status(errorResponse.statusCode).json(errorResponse);
  }



  try {
    const userId = req.params.id;
    if (!userId) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "User ID is required.",
        statusCode: 400,
      };
      logger.warn("User ID is missing in request");

      return res.status(errorResponse.statusCode).json(errorResponse);
    
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    // Extract fields from request body
    const personData =
      typeof req.body.personData === "string"
        ? JSON.parse(req.body.personData)
        : req.body;

    let {
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

    let addressId;

    // handle profileImage
    let profileImage: string | null = null;
    if (req.file) {
      const file = req.file;
      const result = await uploadFileToS3(
        file?.originalname,
        file?.buffer,
        AWS_S3_AVATAR_FOLDER
      );
      profileImage = result.Location;
      logger.info(`userId: ${userId} Profile image uploaded: ${profileImage}`);
    }

    const profile = await PersonModel.findOne({ userId });

    if (!profile) {
      throw new Error("Profile not found");
    }

    console.log("aaaa", address[0]?.fullAddress);

    const currentAddress = await AddressModel.findOne({
      _id: profile.addressId,
    });

    console.log("aaaa", currentAddress?.fullAddress);

    if (
      !currentAddress ||
      currentAddress.fullAddress !== address[0]?.fullAddress
    ) {
      logger.info("Address has changed or not found. Creating new address.");

      const addressInput = Array.isArray(personData.address)
        ? personData.address[0]
        : personData.address;

      if (addressInput) {
        const addressWithCreator = {
          ...addressInput,
        };

        const newAddress = await AddressModel.create(addressWithCreator);
        addressId = newAddress._id;
        logger.info(
          `userId: ${userId} New address created with ID: ${newAddress._id}`
        );
      }
    }
    // === Update basic fields in UserModel ===
    const user = await UserModel.findById(objectUserId);
    if (!user) {
      logger.warn("User not found during profile update");
     return res.status(404).json({ success: false, message: "User not found" });
    }

    let userModified = false;

    if (firstName && firstName !== user.firstName) {
      user.firstName = firstName;
      userModified = true;
      logger.info(`userId: ${userId} User basic info updated for`);
    }

    if (middleInitial && middleInitial !== user.middleInitial) {
      user.middleInitial = middleInitial;
      userModified = true;
    }

    if (lastName && lastName !== user.lastName) {
      user.lastName = lastName;
      userModified = true;
    }
    if (email && email !== user.email) {
      user.email = email;
      userModified = true;
    }
    if (phone && phone !== user.phone) {
      user.phone = phone;
      userModified = true;
    }

    if (userModified) {
      await user.save();
    }

    // === Update or Create PersonModel entry for extended fields ===
    const personUpdate: Record<string, any> = {
      updatedby: userId,
      ...(workPhone && { workPhone }),
      ...(email2 && { email2 }),
      ...(suiteNo && { suiteNo }),
      ...(webUrl && { webUrl }),
      ...(linkedinUrl && { linkedinUrl: linkedinUrl }),
      ...(addressId ? { addressId } : {}),
      profileImage: profileImage,
    };

    const existingPerson = await PersonModel.findOne({
      userId: objectUserId,
    });

    if (!existingPerson) {
      await PersonModel.create(
        [
          {
            userId: objectUserId,
            createdBy: userId,
            updatedBy: userId,
            ...personUpdate,
          },
        ],
        
      );
      logger.info(` userId: ${userId} Created new person entry `);
    } else {
      await PersonModel.updateOne(
        { userId: objectUserId },
        { $set: personUpdate },
   
      );
      logger.info(` userId: ${userId} Updated person entry`);
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
          linkedinUrl: "$personData.linkedinURL",
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
        error: "No user profile found after update",
        message: "Updated profile not found.",
      });
    }

    logger.info(`UserId: ${userId}: Profile updated successfully`);

    res.status(200).json({
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
    const errorResponse: ErrorResponse = {
      success: false,
      message: "Internal Server Error",
      statusCode: 500,
      error: error.message,
    };
    res.status(errorResponse.statusCode).json(errorResponse);
  }
};
