
import { logger } from "../configs/winstonConfig";
import { AddressModel } from "../models/AddressModel";
import BorrowerCompanyModel, { IBorrowerCompany } from "../models/BorrowerCompanyModel";
import { DealDataRequest } from "../models/DealDataRequestModel";


export class newDealRepository {
  async createBorrowerCompany(data: any): Promise<IBorrowerCompany> {
    try {
      // Step 1: Create Address (if provided)
      let newAddress = null;
      if (data.address) {
        const addressInput = Array.isArray(data.address) ? data.address[0] : data.address;

        if (addressInput) {
          const addressWithCreator = {
            ...addressInput
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
        requestedDate:  new Date(),
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
}
