
import { Types } from "mongoose";
import { logger } from "../configs/winstonConfig";
import { AddressModel } from "../models/AddressModel";
import BorrowerCompanyModel, { IBorrowerCompany } from "../models/BorrowerCompanyModel";
import { DealDataRequest } from "../models/DealDataRequestModel";
import GuarantorModel from "../models/GuarantorModel";
import { Person } from "../models/PersonModel";


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
    const totalOwnership = guarantors.reduce(
      (sum, g) => sum + g.percentageOfOwnership,
      0
    );

    if (totalOwnership !== 100) {
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

    return results;
  }

  async getByDealDataReqId(dealDataReqId: Types.ObjectId) {
    return GuarantorModel.aggregate([
      { $match: { dealDataReqId } },
      // Lookup person details (assuming you have a Person collection)
      {
        $lookup: {
          from: "persons",
          localField: "personId",
          foreignField: "_id",
          as: "person",
        },
      },
      {
        $unwind: {
          path: "$person",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "persons",
          localField: "personId",
          foreignField: "_id",
          as: "person",
        },
      },
      {
        $unwind: {
          path: "$person",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "person.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Lookup address details
      {
        $lookup: {
          from: "addresses",
          localField: "addressId",
          foreignField: "_id",
          as: "address",
        },
      },
      {
        $unwind: {
          path: "$address",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Lookup borrower company
      {
        $lookup: {
          from: "borrowercompanies",
          localField: "borrowerCompanyId",
          foreignField: "_id",
          as: "borrowerCompany",
        },
      },
      {
        $unwind: {
          path: "$borrowerCompany",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Project only necessary fields (optional)
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
  }
  async findCompanyById(dealDataReqId: any) {
    console.log("sdjkksjdjkdsjk");
    const deal = await DealDataRequest.findOne({
      borrowerCompanyId: dealDataReqId,
    });

    if (!deal) {
      throw new Error("DealDataRequest not found");
    }

    return deal;
  }
}
