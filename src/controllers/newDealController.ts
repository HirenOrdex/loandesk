import { Request, RequestHandler, Response } from "express";
import {  newDealRepository } from "../repositories/newDealRepository";
import { IBorrowerCompany } from "../models/BorrowerCompanyModel";
import { logger } from "../configs/winstonConfig";

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
}