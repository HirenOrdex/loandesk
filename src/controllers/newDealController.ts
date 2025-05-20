import { Request, RequestHandler, Response } from "express";
import { newDealRepository } from "../repositories/newDealRepository";
import { IBorrowerCompany } from "../models/BorrowerCompanyModel";
import { logger } from "../configs/winstonConfig";
import { Types } from "mongoose";
import { IError } from "../types/errorType";
import { error } from "winston";
const controllerName: string = "newDealController";


export class NewDealController {
  private NewDealRepository: newDealRepository;

  constructor() {
    this.NewDealRepository = new newDealRepository();
  }

  createBorrowerCompany: RequestHandler = async (req: Request, res: any) => {
    const functionName = "createBorrowerCompany";
    logger.info(`Coming into Controller ${controllerName} - ${functionName}`);
    try {
      const data: IBorrowerCompany = req.body;

      const { borrowerCompany, dealDataRequestId } = await this.NewDealRepository.createBorrowerCompany(data);
      logger.info(`BorrowerCompany created successfully with ID: ${borrowerCompany._id}`);
      return res.status(200).json({
        success: true,
        data: {
          borrowerCompany,
          dealDataRequestId,
        },
        message: "Borrower company created successfully",
        error: null,
      });
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Error in controller while creating borrower company: ${err.message}`);
      logger.error(`Error in controller while creating borrower company: ${err.message}`);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Internal server error",
        error: err.message,
      });
    }
  };
  createMultiple: RequestHandler = async (req: Request, res: any) => {
    try {
      const { guarantors } = req.body;
      const dealReqId = req.params.id;
      const functionName = "createMultiple";
      logger.info(`[${controllerName}] → ${functionName} → Start`);
      logger.debug(`Request path: ${dealReqId}`);
      logger.debug(`Request Body: ${JSON.stringify(req.body)}`);
      console.debug(`Request Body: ${JSON.stringify(req.body)}`);

      if (!Array.isArray(guarantors) || guarantors.length === 0) {
        return res.status(400).json({ message: "Invalid guarantor data" });
      }

      const dealData = await this.NewDealRepository.findDealReqById(
        dealReqId.toString()
      );
      const borrowerCompanyId = dealData.borrowerCompanyId; // extract just the ID

      const result = await this.NewDealRepository.createMultipleGuarantors(
        guarantors,
        borrowerCompanyId,
        dealReqId
      );

      return res.status(201).json({
        success: true,
        data: result,
        message: "Guarantors processed successfully",
        error: null,
      });
    } catch (error: any) {
      console.error("Error in GuarantorController.createMultiple:", error);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Failed to process guarantors",
        error: error.message,
      });
    }
  }

  getByDealDataReqId: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { dealDataReqId } = req.params;
      const objectId = new Types.ObjectId(dealDataReqId);
      const guarantors = await this.NewDealRepository.getByDealDataReqId(objectId);
      res.json({ data: guarantors });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch guarantors", error: error.message });
    }
  }

  updateBorrowerCompany: RequestHandler = async (req: Request, res: any) => {
    const functionName = "updateBorrowerCompany";
    logger.info(`Coming into Controller ${controllerName} - ${functionName}`);

    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "Missing borrower company ID in request params",
          error: "ID is required",
        });
      }

      const { borrowerCompany, dealDataRequestId } = await this.NewDealRepository.updateBorrowerCompany(id, updateData);
      if (!borrowerCompany) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Borrower company not found",
          error: "Not Found",
        });
      }

      logger.info(`BorrowerCompany updated successfully with ID: ${borrowerCompany._id}`);

      return res.status(200).json({
        success: true,
        data: {
          borrowerCompany,
          dealDataRequestId,
        },
        message: "Borrower company updated successfully",
        error: null,
      });
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(`Error in controller while updating borrower company: ${err.message}`);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Internal server error",
        error: err.message,
      });
    }
  };
  getBorrowerCompanyById: RequestHandler = async (req: Request, res: any) => {
    const functionName = "getBorrowerCompanyById";
    logger.info(`Coming into Controller ${controllerName} - ${functionName}`);

    try {
      const borrowerCompanyId = req.params.id;

      logger.info(`Entering ${controllerName} - ${functionName} with ID: ${borrowerCompanyId}`);

      const borrowerCompany = await this.NewDealRepository.getBorrowerCompanyById(borrowerCompanyId);

      return res.status(200).json({
        success: true,
        data: borrowerCompany,
        message: "Borrower company fetched successfully",
        error: null,
      });
    } catch (error: any) {
      console.error(`Error in ${functionName}:`, error.message);
      logger.error(`Error in ${functionName}: ${error.message}`);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Failed to fetch borrower company",
        error: error.message,
      });
    }
  };

  updateGuarantor: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
      const dealDataReqId = req.params.id;
      const { guarantors } = req.body;
      const functionName = "updateGuarantorsByDeal";

      logger.info(`[${controllerName}] → ${functionName} → Start`);
      logger.debug(`Request path: ${dealDataReqId}`);
      logger.debug(`Request Body: ${JSON.stringify(req.body)}`);
      console.debug(`Request Body: ${JSON.stringify(req.body)}`);
      if (!Array.isArray(guarantors) || guarantors.length === 0) {
        return res.status(400).json({ message: "Guarantors array is required" });
      }
      const updated = await this.NewDealRepository.updateGuarantorsByDealDataReqId(
        dealDataReqId,
        guarantors
      );
      return res.status(200).json({
        success: true,
        data: updated,
        message: "Guarantors updated successfully",
        error: null,
      });
    } catch (err) {
      logger.error("Error in patchGuarantorsByDeal", err);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Internal Server Error",
        error: (err as Error).message,
      });
    }
  };
   createMultipleLoanDetails:RequestHandler =  async (req: Request, res: Response): Promise<any> =>{
  const functionName = "createMultipleLoanDetails";

  try {
    const { loanDetails } = req.body;
    const dealDataReqId = req.params.id;

    logger.info(`[${controllerName}] → ${functionName} → Start`);
    logger.debug(`DealDataRequest ID: ${dealDataReqId}`);
    console.debug("Request Body:", loanDetails);

    if (!Array.isArray(loanDetails) || loanDetails.length === 0) {
      return res.status(400).json({ message: "Invalid loan details array" });
    }

    const result = await this.NewDealRepository.createMultiple(loanDetails, dealDataReqId);

    return res.status(201).json({
      success: true,
      data: result,
      message: "Loan details created successfully",
      error:null
    });
  } catch (err: unknown) {
    const error = err as IError;
    logger.error(`[${controllerName}] → ${functionName} → Failed`, { error });
    console.error(`[${controllerName}] Error:`, error.message);

    return res.status(500).json({
      success: false,
      data:null,
      message: "Failed to create loan details",
      error: error.message,
    });
  }
};

 getLoanDetailById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const functionName = "getLoanDetailById";

  try {
    const result = await this.NewDealRepository.findById(id);

    if (!result) {
      return res.status(404).json({ message: "Loan detail not found" });
    }

    return res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as IError;
    logger.error(`[${controllerName}] → ${functionName} → Failed`, { error });
    return res.status(500).json({ message: error.message });
  }
};

//  updateLoanDetailById = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const updateData = req.body;
//   const functionName = "updateLoanDetailById";

//   try {
//     const result = await this.NewDealRepository.updateById(id, updateData);

//     if (!result) {
//       return res.status(404).json({ message: "Loan detail not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       data: result,
//       message: "Loan detail updated successfully",
//     });
//   } catch (err: unknown) {
//     const error = err as IError;
//     logger.error(`[${controllerName}] → ${functionName} → Failed`, { error });
//     return res.status(500).json({ message: error.message });
//   }
// };
}