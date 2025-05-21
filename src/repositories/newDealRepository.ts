
import { Types } from "mongoose";
import { logger } from "../configs/winstonConfig";
import { AddressModel } from "../models/AddressModel";
import BorrowerCompanyModel, { IBorrowerCompany } from "../models/BorrowerCompanyModel";
import { DealDataRequest } from "../models/DealDataRequestModel";
import GuarantorModel from "../models/GuarantorModel";
import { Person } from "../models/PersonModel";
import { IBorrowerCompanyRequest } from "../types/newDeal.type";
import { IError } from "../types/errorType";
import { DealDataStructure, IDealDataStructure } from "../models/DealDataStructureModel";
import User, { IUser } from "../models/User";
import { UserRepository } from "./userRepository";
import { AdditionalPeopleDetailModel, IAdditionalPeopleDetail } from "../models/AdditionalPeopleDetail.model";
import { RoleModel } from "../models/RoleModel";
import { title } from "process";
const userRepository = new UserRepository();

export class newDealRepository {

  async createBorrowerCompany(data: any,  userId: string,role: string): Promise<{ borrowerCompany: IBorrowerCompany; dealDataRequestId: string }> {
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
       const dealRequestPayload: any = {
      referenceNo,
      borrowerCompanyId: newBorrowerCompany._id,
      currentStep: 1,
      requestedDate: new Date(),
      active: true,
    };

    if (role === "Banker") {
      dealRequestPayload.bankerId = userId;
    } else if (role === "Borrower") {
      dealRequestPayload.borrowerId = userId;
    }

    const newDeal = await DealDataRequest.create(dealRequestPayload);

      return {
        borrowerCompany: newBorrowerCompany,
        dealDataRequestId: String(newDeal._id),
      };
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Error creating borrower company: ${err.message}`);
      logger.error(`Error creating borrower company: ${err.message}`);
      throw new Error(`Error creating borrower company: ${err.message}`);
    }
  }

  async findOrUpdateUser(personData: any) {
    let user = await User.findOne({ email: personData.email });
    const roleId = await userRepository.findRoleIdByName("Guarantor");

    const userDataWithRole = {
      firstName: personData.firstName,
      email:personData.email,
      middleInitial: personData.middleInitial,
      lastName: personData.lastName,
      roleId,
    };

    const person_Data = {
      workPhone: personData.workPhone,
      isUsCitizen:personData.isUsCitizen,
      suiteNo:personData.suiteNo,
      title:personData.title
    };

    if (user) {
      let person = await Person.findOne({ userId: user._id });

      if (person) {
        await User.updateOne({ _id: user._id }, userDataWithRole);
        await Person.updateOne({ _id: person._id }, person_Data);
      } else {
        await Person.create({
          ...person_Data,
          userId: user._id,
        });
      }
    } else {
      user = await User.create(userDataWithRole);

      await Person.create({
        ...person_Data,
        userId: user._id,
      });
    }

    return user; // ✅ Return the full user object
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
      const user = await this.findOrUpdateUser(g.person);

      // Handle address
      let address = null;
      if (g.person.address) {
        address = await AddressModel.create(g.person.address);
      }

      const guarantorPayload = {
        borrowerCompanyId,
        userId: user._id,
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
          from: "user",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "dealDataRequest",
          localField: "dealDataReqId",
          foreignField: "_id",
          as: "dealDataRequest",
        },
      },
      {
        $unwind: {
          path: "$dealDataRequest",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "person",
          localField: "user._id",
          foreignField: "userId",
          as: "person",
        },
      },
      { $unwind: { path: "$person", preserveNullAndEmptyArrays: true } },

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
      {
        $unwind: { path: "$borrowerCompany", preserveNullAndEmptyArrays: true },
      },

      {
        $project: {
          isGuarantor: 1,
          percentageOfOwnership: 1,
          numberOfCOI: 1,
          dealDataReqId:1,
          active: 1,
          createdAt: 1,
          updatedAt: 1,
          currentStep: "$dealDataRequest.currentStep" ,
          user: {
            firstname: 1,
            middleInitial:1,
            lastName:1,
            email1: 1,
            phone: 1,
          },
          title:"$person.title",
          suiteNo:"$person.suiteNo",
          workPhone:"$person.workPhone",
          isUsCitizen:"$person.isUsCitizen",
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

 async findDealReqById(dealDataReqId: any) {
  try {
    const deal = await DealDataRequest.findById(dealDataReqId);

    if (!deal) {
      logger.warn(`No DealDataRequest found for dealId: ${dealDataReqId}`);
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
        await Person.findOneAndUpdate(existing.userId, g.person);
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
  async createMultipleLoan(details: any[], dealDataReqId: string) {
    try {
      const results = [];

      for (const d of details) {
        const payload: IDealDataStructure = {
          ...d,
          dealDataReqId,
        };

        const loanDetail = await DealDataStructure.create(payload);
        results.push(loanDetail);
      }
      const crruentStep = await DealDataRequest.findByIdAndUpdate(dealDataReqId, { currentStep: 3 })

      logger.info("✅ Successfully created multiple loan details");
      console.log("✅ LoanDetails inserted successfully");
      return results;
    } catch (err: unknown) {
      const error = err as IError;
      logger.error("❌ Error in createMultiple:", { message: error.message });
      console.error("❌ Error in createMultiple:", error.message);
      throw error;
    }
  }

  async findLoanBDealById(dealDataReqId: string) {
    try {
      console.log("", dealDataReqId)
      return await DealDataStructure.aggregate([
        {
          $match: {
            dealDataReqId: new Types.ObjectId(dealDataReqId) // Ensure it's ObjectId
          }
        }, {
          $lookup: {
            from: "dealDataRequest",
            localField: "dealDataReqId",
            foreignField: "_id",
            as: "dealDataRequest",
          },
        },
        {
          $unwind: {
            path: "$dealDataRequest",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            loanType: 1,
            loanAmount: 1,
            rate: 1,
            amortization: 1,
            paymentType: 1,
            sba: 1,
            term: 1,
            active: 1,
            dealDataReqId: 1,
            currentStep: "$dealDataRequest.currentStep",
          },
        },
      ]);
    } catch (err: unknown) {
      const error = err as IError;
      logger.error("❌ Error in findById:", { message: error.message });
      throw error;
    }
  }

  async updateBorrowerCompany(borrowerCompanyId: string, updateData: IBorrowerCompanyRequest): Promise<{ borrowerCompany: IBorrowerCompany | null; dealDataRequestId: string | null }> {

    try {
      // 1. Find the borrower company
      const borrowerCompany = await BorrowerCompanyModel.findById(borrowerCompanyId);
      if (!borrowerCompany) {
        throw new Error("Borrower company not found");
      }
      console.log("borrowerCompany....", borrowerCompany);

      if (updateData.address && updateData.address[0]) {
        await AddressModel.findByIdAndUpdate(
          borrowerCompany.addressId,
          { $set: updateData.address[0] }, // ✅ pass actual address data
          { new: true, runValidators: true }
        );
      }

      // 3. Remove address from updateData
      const { address, ...borrowerCompanyData } = updateData;

      // 4. Update borrower company fields
      const updatedCompany = await BorrowerCompanyModel.findByIdAndUpdate(
        borrowerCompanyId,
        { $set: borrowerCompanyData },
        { new: true, runValidators: true }
      );
      const deal = await DealDataRequest.findOne({ borrowerCompanyId }).select("_id").lean();

      return {
        borrowerCompany: updatedCompany,
        dealDataRequestId: deal ? String(deal._id) : null
      };
    } catch (error: any) {
      console.error("Error updating borrower company and address:", error.message);
      throw new Error("Failed to update borrower company and address");
    }
  }
  async getBorrowerCompanyById(id: string): Promise<IBorrowerCompany | null> {
    try {

      const result = await DealDataRequest.aggregate([
        {
          $match: { _id: new Types.ObjectId(id) }
        },
        {
          $lookup: {
            from: "borrowerCompany",
            localField: "borrowerCompanyId",
            foreignField: "_id",
            as: "borrowerCompany"
          }
        },
        {
          $unwind: {
            path: "$borrowerCompany",
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $lookup: {
            from: "address",
            localField: "borrowerCompany.addressId",
            foreignField: "_id",
            as: "borrowerCompany.address"
          }
        },
        {
          $unwind: {
            path: "$borrowerCompany.address",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            dealDataRequestId: "$_id",
            "borrowerCompany.borrowerCompanyId": "$borrowerCompany._id",
            "borrowerCompany.address.addressId": "$borrowerCompany.address._id"
          }
        },
        {
          $project: {
            _id: 0,
            "borrowerCompany._id": 0,
            "borrowerCompany.address._id": 0
          }
        }
      ]);
      if (!result || result.length === 0) {
        throw new Error("Borrower company not found");
      }

      return result[0]; // Return the enriched deal + company + address
    } catch (error: any) {
      console.error("Error in getBorrowerCompanyById:", error.message);
      throw new Error("Failed to retrieve borrower company data");
    }
  }
    async createAdditionalPeople(data: any,  dealDataReqId: any): Promise<IAdditionalPeopleDetail> {
    try {
    if (data.appSkip === true) {
      const additionalPeople = await AdditionalPeopleDetailModel.create({
        appSkip: true,
        dealDataReqId: dealDataReqId,          
        active: true,
      });

      await DealDataRequest.findByIdAndUpdate(dealDataReqId, { currentStep: 4, appSkip: data.appSkip });

      return additionalPeople;
    }
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
      // 1. Create user
     const newUser = await User.create({
      email: data.email1,
      firstName: data.firstName,
      middleInitial: data.middleInitial,
      roleId: data.roleId,
      lastName: data.lastName,
      cellPhone: data.cellPhone,
      title: data.titleRelationship
    });

    // 2. Create Person with userId as foreign key and additional fields
    const newPerson = await Person.create({
      userId: newUser._id,
      email2: data.email2,
      addressId:  newAddress?._id ?? null, // This should be an ObjectId of Address
      workPhone: data.workPhone,
    });

      // 2. Use user ID in AdditionalPeopleDetail
      const additionalPeople = await AdditionalPeopleDetailModel.create({
      dealDataReqId: dealDataReqId,
      guarantorIds: data.guarantorIds ?? [],
      coiForCompany: data.coiForCompany ?? null,
      borrowerCompanyId: data.borrowerCompanyId ?? null,
      personId: newPerson._id,
      active: true,
      suiteNo: data.suiteNo
      });
      const currentStep = await DealDataRequest.findByIdAndUpdate(dealDataReqId,{currentStep:4})
      return additionalPeople;
    } catch (error: any) {
      console.error("Error creating additional people detail:", error.message);
      throw new Error("Failed to create additional people detail");
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


  async updateMultipleLoan(details: any[]) {
    try {
      const results = [];

      for (const d of details) {
        const { _id, ...updates } = d;

        if (!_id) {
          throw new Error("Each object must include an _id for update.");
        }
        console.log("id", _id)
        // Step 1: Find the document to get dealDataReqId
        const existing = await DealDataStructure.findById(_id);
        if (!existing) {
          logger.warn(`⚠️ Loan detail not found: _id=${_id}`);
          continue;
        }

        const Id = existing._id;

        // Step 2: Update using _id + dealDataReqId
        const updated = await DealDataStructure.findOneAndUpdate(
          { _id },
          { $set: updates },
          { new: true }
        );
        console.log("Id", Id)
        if (updated) {
          results.push(updated);
        } else {
          logger.warn(`⚠️ Failed to update loan detail: _id=${_id}`);
        }
      }

      logger.info("✅ Successfully updated multiple loan details");
      console.log("✅ LoanDetails updated successfully");
      return results;
    } catch (err: unknown) {
      const error = err as IError;
      logger.error("❌ Error in updateMultipleLoan:", { message: error.message });
      console.error("❌ Error in updateMultipleLoan:", error.message);
      throw error;
    }
  }

  async getFinalLoanData(dealDataReqId: string) {
    try {
      const result = await GuarantorModel.aggregate([
        {
          $match: {
            dealDataReqId: new Types.ObjectId(dealDataReqId) // Ensure it's ObjectId 
          }
        },

        {
          $lookup: {
            from: "user",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "dealDataRequest",
            localField: "dealDataReqId",
            foreignField: "_id",
            as: "dealDataRequest",
          },
        },
        {
          $unwind: {
            path: "$dealDataRequest",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "person",
            localField: "user._id",
            foreignField: "userId",
            as: "person",
          },
        },
        { $unwind: { path: "$person", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "dealDataStructure",
            localField: "dealDataReqId",
            foreignField: "dealDataReqId",
            as: "dealDataStructure",
          },
        },
        { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },


        {
          $project: {
            percentageOfOwnership: 1,
            dealDataReqId: 1,
            firstName: "$user.firstName",
            email: "$user.email",
            isUsCitizen: "$person.isUsCitizen",
            active: 1,
            currentStep: "$dealDataRequest.currentStep",
            dealDataStructure: {
              loanAmount: 1,
              loanType: 1,
              _id: 1,
              term: 1
            },
          },
        },
      ])
      console.log(`Fetched final LoanDeatils for dealDataReqId: ${dealDataReqId}`);

      logger.info(`Fetched final LoanDeatils for dealDataReqId: ${dealDataReqId}`);
      return result;
    } catch (err: unknown) {
      const error = err as IError;
      console.error(`Error in getFinalLoanData: ${error.message}`, { error });

      logger.error(`Error in getFinalLoanData: ${error.message}`, { error });
      throw error;
    }
  }
}
