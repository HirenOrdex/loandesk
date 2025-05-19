
import { Types } from "mongoose";
import { logger } from "../configs/winstonConfig";
import { AddressModel } from "../models/AddressModel";
import BorrowerCompanyModel, { IBorrowerCompany } from "../models/BorrowerCompanyModel";
import { DealDataRequest } from "../models/DealDataRequestModel";
import GuarantorModel from "../models/GuarantorModel";
import { Person } from "../models/PersonModel";
import { IError } from "../types/errorType";


export class newDealRepository {
  async createBorrowerCompany(data: any): Promise<IBorrowerCompany> {
    try {
      // Step 1: Create Address (if provided)
      let newAddress = null;
      if (data.address) {
        const addressInput = Array.isArray(data.address)
          ? data.address[0]
          : data.address;

        if (addressInput) {
          const addressWithCreator = {
            ...addressInput,
            // createdBy: data.createdBy, // passed from request body or middleware
          };
          newAddress = await AddressModel.create(addressWithCreator);
        }
      }

      // Step 2: Create BorrowerCompany using Address ID as foreign key
      const newBorrowerCompany = await BorrowerCompanyModel.create({
        companyName: data.companyName,
        legalEntity: data.legalEntity,
        businessPhone: data.businessPhone,
        website: data.website,
        suite: data.suite,
        isDelete: false,
        addressId: newAddress?._id ?? null,
      });

      // Step 3: Generate Reference Number (e.g. LH-S1000001)
      const lastDeal = await DealDataRequest.findOne({})
        .sort({ createdAt: -1 })
        .lean();

      let newNumber = 1000001;
      if (lastDeal?.referenceNo) {
        const lastNum = parseInt(lastDeal.referenceNo.split("S")[1]);
        if (!isNaN(lastNum)) {
          newNumber = lastNum + 1;
        }
      }
      const referenceNo = `LH-S${newNumber}`;

      // Step 4: Create DealDataRequest
      await DealDataRequest.create({
        referenceNo,
        borrowerCompanyId: newBorrowerCompany._id,
        currentStep: 1,
        requestedDate: new Date(),
        active: true,
      });

      return newBorrowerCompany;
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Error creating borrower company: ${err.message}`);
      logger.error(`Error creating borrower company: ${err.message}`);
      throw new Error(`Error creating borrower company: ${err.message}`);
    }
  }
  async findOrUpdatePerson(personData: any) {
    let person = await Person.findOne({ email1: personData.email1 });

    if (person) {
      await Person.updateOne({ _id: person._id }, personData);
    } else {
      person = await Person.create(personData);
    }

    return person;
  }

  async createGuarantor(data: any) {
    return GuarantorModel.create(data);
  }
  async createMultipleGuarantors(
  guarantors: any[],
  borrowerCompanyId: Types.ObjectId,
  dealDataReqId: any
) {
  try {
    const totalOwnership = guarantors.reduce(
      (sum, g) => sum + g.percentageOfOwnership,
      0
    );

    if (totalOwnership !== 100) {
      console.warn("Total percentageOfOwnership is not 100");
      logger.warn("Total percentageOfOwnership is not 100");
      throw new Error("Total percentageOfOwnership must equal 100");
    }

    const results = [];

    for (const g of guarantors) {
      // Handle person
      const person = await this.findOrUpdatePerson(g.person);

      // Handle address
      let address = null;
      if (g.person.address) {
        address = await AddressModel.create(g.person.address);
      }

      const guarantorPayload = {
        borrowerCompanyId,
        personId: person._id,
        isGuarantor: g.isGuarantor,
        percentageOfOwnership: g.percentageOfOwnership,
        numberOfCOI: g.numberOfCOI,
        active: g.active,
        createdBy: g.createdBy,
        updatedBy: g.updatedBy,
        dealDataReqId,
        addressId: address?._id || null,
      };

      const newGuarantor = await this.createGuarantor(guarantorPayload);
      results.push(newGuarantor);
    }
    const crruentStep = await DealDataRequest.findByIdAndUpdate(dealDataReqId,{currentStep:2})
    console.log("Successfully created multiple guarantors");

    logger.info("Successfully created multiple guarantors");
    return results;
  } catch (err: unknown) {
 
    const error = err as IError;
    console.error(`Error in createMultipleGuarantors: ${error.message}`, { error });
 
    logger.error(`Error in createMultipleGuarantors: ${error.message}`, { error });
    throw error;
  }
}

 async getByDealDataReqId(dealDataReqId: Types.ObjectId) {
  try {
    const result = await GuarantorModel.aggregate([
      { $match: { dealDataReqId } },

      {
        $lookup: {
          from: "persons",
          localField: "personId",
          foreignField: "_id",
          as: "person",
        },
      },
      { $unwind: { path: "$person", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "users",
          localField: "person.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "addresses",
          localField: "addressId",
          foreignField: "_id",
          as: "address",
        },
      },
      { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "borrowercompanies",
          localField: "borrowerCompanyId",
          foreignField: "_id",
          as: "borrowerCompany",
        },
      },
      { $unwind: { path: "$borrowerCompany", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          isGuarantor: 1,
          percentageOfOwnership: 1,
          numberOfCOI: 1,
          active: 1,
          createdAt: 1,
          updatedAt: 1,
          person: {
            firstname: 1,
            email1: 1,
            contact1: 1,
          },
          address: {
            city: 1,
            state: 1,
            country: 1,
            fulladdress: 1,
          },
          borrowerCompany: {
            companyName: 1,
            legalEntity: 1,
            website: 1,
          },
        },
      },
    ]);
    console.log(`Fetched guarantors for dealDataReqId: ${dealDataReqId}`);

    logger.info(`Fetched guarantors for dealDataReqId: ${dealDataReqId}`);
    return result;
  }catch (err: unknown) {
        const error = err as IError;
            console.error(`Error in getByDealDataReqId: ${error.message}`, { error });

    logger.error(`Error in getByDealDataReqId: ${error.message}`, { error });
    throw error;
  }
}

 async findCompanyById(dealDataReqId: any) {
  try {
    const deal = await DealDataRequest.findById(dealDataReqId);

    if (!deal) {
      logger.warn(`No DealDataRequest found for borrowerCompanyId: ${dealDataReqId}`);
      throw new Error("DealDataRequest not found");
    }

    return deal;
  } catch (err: unknown) {
      const error = err as IError;
          console.error(`Error in findCompanyById: ${error.message}`, { error });

    logger.error(`Error in findCompanyById: ${error.message}`, { error });
    throw error;
  }
}
async updateGuarantorsByDealDataReqId(
  dealDataReqId: string,
  guarantors: any[]
) {
  try {
    const totalOwnership = guarantors.reduce(
      (sum, g) => sum + g.percentageOfOwnership,
      0
    );

    if (totalOwnership !== 100) {
      logger.warn("Total percentageOfOwnership is not 100");
      throw new Error("Total percentageOfOwnership must equal 100");
    }

    const updatedResults = [];

    for (const g of guarantors) {
      if (!g.guarantorId) {
        throw new Error("guarantorId is required for update");
      }

      const existing = await GuarantorModel.findOne({
        _id: g.guarantorId,
        dealDataReqId,
      });

      if (!existing) {
        throw new Error(`Guarantor not found with id ${g.guarantorId}`);
      }

      // Update person
      if (g.person) {
        await Person.findOneAndUpdate(existing.personId, g.person);
      }

      // Update address
      if (g.person?.address && existing.addressId) {
        await AddressModel.findByIdAndUpdate(existing.addressId, g.person.address, {
          new: true,
        });
      }

      // Update guarantor fields
      await GuarantorModel.findByIdAndUpdate(
        g.guarantorId,
        {
          isGuarantor: g.isGuarantor,
          percentageOfOwnership: g.percentageOfOwnership,
          numberOfCOI: g.numberOfCOI,
          active: g.active,
          updatedBy: g.updatedBy,
        },
        { new: true }
      );

      updatedResults.push({ guarantorId: g.guarantorId });
    }
    const crruentStep = await DealDataRequest.findByIdAndUpdate(dealDataReqId,{currentStep:2})

    logger.info("Guarantors updated successfully", { dealDataReqId });
    return updatedResults;
  } catch (err) {
    const error = err as IError;
    logger.error(`Error updating guarantors: ${error.message}`, { error });
    throw error;
  }
}

}
