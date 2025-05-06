import { Request, Response, NextFunction } from "express";
import { BankerRepossitory } from "../repositories/bankerRepository";
import { logger } from "../configs/winstonConfig";


const bankerRepository = new BankerRepossitory();
export class BankerController {
async createBanker(req: Request, res: Response): Promise<any> {
    try {
      const {
        financialInstitutionName,
        email,
        password,
        firstName,
        middleInitial,
        lastName,
        phone,
        title,
        areaOfSpecialty,
        address,
        bankType,
        assetSize
      } = req.body;
  
      // Validate required fields
      if (!financialInstitutionName || !email || !password || !firstName || !lastName || !phone || !address) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Missing required fields',
          error: 'Missing required fields',
        });
      }

      const hashedPassword = await bankerRepository.hashPassword(password);
  
      // Create the banker
      const result = await bankerRepository.createBanker({
        financialInstitutionName,
        email,
        password:hashedPassword,
        firstName,
        middleInitial,
        lastName,
        phone,
        title,
        areaOfSpecialty,
        address,
        bankType,
        assetSize,
      });
  
      return res.status(201).json({
        success: true,
        message: 'Banker created successfully',
        data: result,
        error: null,
      });
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(`Error creating banker: ${err.message}`);
      return res.status(500).json({
        success: false,
        data: null,
        message: 'Internal Server Error',
        error: `Error creating banker: ${err.message}`,
      });
    }
  };
  async updateBanker(req: Request, res: Response): Promise<any> {
    try {
      const bankerId = req.params.id;
      const updateData = req.body;
  
      if (!bankerId) {
        return res.status(400).json({
          success: false,
          message: "Banker ID is required in params",
          data: null,
          error: "Missing banker ID",
        });
      }
  
      const updated = await bankerRepository.updateBanker(bankerId, updateData);
  
      return res.status(200).json({
        success: true,
        message: "Banker updated successfully",
        data: updated,
        error: null,
      });
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Error updating banker: ${err.message}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
        error: err.message,
      });
    }
  };
}

export default new BankerController();