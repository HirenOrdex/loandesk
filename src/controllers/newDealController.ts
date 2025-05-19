import { Request, RequestHandler, Response } from "express";
import { newDealRepository } from "../repositories/newDealRepository";
import { IBorrowerCompany } from "../models/BorrowerCompanyModel";
import { logger } from "../configs/winstonConfig";
import { Types } from "mongoose";
const controllerName: string = "newDealController";

export class NewDealController {
  private NewDealRepository: newDealRepository;

  constructor() {
    this.NewDealRepository = new newDealRepository();
  }

  createBorrowerCompany: RequestHandler = async (req: Request, res: any) => {
    try {
      const data: IBorrowerCompany = req.body;

      const newBorrowerCompany = await this.NewDealRepository.createBorrowerCompany(data);
      logger.info(`BorrowerCompany created successfully with ID: ${newBorrowerCompany._id}`);
      return res.status(200).json({
        success: true,
        data: newBorrowerCompany,
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

      const dealData = await this.NewDealRepository.findCompanyById(
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
        message: "Guarantors updated successfully",
        data: updated,
      });
    } catch (err) {
      logger.error("Error in patchGuarantorsByDeal", err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: (err as Error).message,
      });
    }
  };
}