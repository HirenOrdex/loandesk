import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import { BankerRepossitory } from "../repositories/bankerRepository";
import { BorrowerRepository } from "../repositories/borrowerRepository";
import { logger } from "../configs/winstonConfig";
import PersonModel from "../models/Person";
import UserModel from "../models/User";
import mongoose from "mongoose";
import { profileUpdateSchema } from "../validators/profileValidator";

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

    // Convert userId string to ObjectId
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const pipeline = [
      { $match: { _id: objectUserId } },
      {
        $lookup: {
          from: "roles",
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
          from: "addresses",
          localField: "personData.addressId",
          foreignField: "_id",
          as: "personAddressData",
        },
      },
      { $unwind: { path: "$personAddressData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "bankers",
          localField: "_id",
          foreignField: "userId",
          as: "bankerData",
        },
      },
      { $unwind: { path: "$bankerData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "addresses",
          localField: "bankerData.addressId",
          foreignField: "_id",
          as: "bankerAddressData",
        },
      },
      { $unwind: { path: "$bankerAddressData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "borrowers",
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
          webURL: "$personData.webURL",
          linkedinURL: "$personData.linkedinURL",
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
      res.status(404).json({
        success: false,
        data: null,
        message: "User profile not found.",
        error: "No user with that ID",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: profileData,
      message: "Profile retrieved successfully.",
      error: null,
    });
  } catch (error: any) {
    logger.error(`Error retrieving profile by ID with pipeline: ${error.message}`);
    res.status(500).json({
      success: false,
      data: null,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const updateProfileById = async (req: Request, res: Response): Promise<void> => {

  const { error } = profileUpdateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      details: error.details.map((d) => d.message),
    });
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({ success: false, message: "User ID is required." });
      return;
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    // Extract fields from request body
    const {
      firstName,
      lastName,
      email,
      phone,
      workPhone,
      email2,
      webURL,
      linkedinUrl,
      addressId,
    } = req.body;

    // === Update basic fields in UserModel ===
    const user = await UserModel.findById(objectUserId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    let userModified = false;

    if (firstName && firstName !== user.firstName) {
      user.firstName = firstName;
      userModified = true;
    }
    if (lastName && lastName !== user.lastName) {
      user.lastName = lastName;
      userModified = true;
    }
    if(email && email !== user.email){
         user.email = email;
      userModified = true;
    }
    if(phone && phone !== user.phone){
         user.phone = phone;
      userModified = true;
    }

    if (userModified) {
      await user.save({ session });
    }

    // === Update or Create PersonModel entry for extended fields ===
    const personUpdate: Record<string, any> = {
      updatedby: userId,
    };

    if (typeof workPhone === "string") personUpdate.workPhone = workPhone;
    if (typeof email2 === "string") personUpdate.email2 = email2;
    if (typeof webURL === "string") personUpdate.webURL = webURL;
    if (typeof linkedinUrl === "string") personUpdate.linkedinurl = linkedinUrl;
    if (typeof addressId === "string") personUpdate.addressId = new mongoose.Types.ObjectId(addressId);

    const existingPerson = await PersonModel.findOne({ userid: objectUserId }).session(session);

    if (!existingPerson) {
      await PersonModel.create(
        [
          {
            userid: objectUserId,
            createdby: userId,
            updatedby: userId,
            ...personUpdate,
          },
        ],
        { session }
      );
    } else {
      await PersonModel.updateOne({ userid: objectUserId }, { $set: personUpdate }, { session });
    }

    // Commit the transaction before aggregation
    await session.commitTransaction();
    session.endSession();


    //pipeline
    const pipeline = [
      { $match: { _id: objectUserId } },
      {
        $lookup: {
          from: "roles",
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
          from: "addresses",
          localField: "personData.addressId",
          foreignField: "_id",
          as: "personAddressData",
        },
      },
      { $unwind: { path: "$personAddressData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "bankers",
          localField: "_id",
          foreignField: "userId",
          as: "bankerData",
        },
      },
      { $unwind: { path: "$bankerData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "addresses",
          localField: "bankerData.addressId",
          foreignField: "_id",
          as: "bankerAddressData",
        },
      },
      { $unwind: { path: "$bankerAddressData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "borrowers",
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
          webURL: "$personData.webURL",
          linkedinURL: "$personData.linkedinURL",
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
      res.status(404).json({
        success: false,
        data: null,
        message: "Updated profile not found.",
        error: "No user profile found after update",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
       data: {
    user,
    person: personUpdate,
  },
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    logger.error(`Error updating profile by ID: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};





