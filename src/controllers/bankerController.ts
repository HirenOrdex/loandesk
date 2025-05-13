import { Request, Response, NextFunction } from "express";
import { BankerRepossitory } from "../repositories/bankerRepository";
import { logger } from "../configs/winstonConfig";

const bankerRepository = new BankerRepossitory();
export class BankerController {
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
  }
  async getAllBankers(req: Request, res: Response): Promise<any> {
    try {
      const bankers = await bankerRepository.getAllBankers();

      return res.status(200).json({
        success: true,
        message: "Bankers retrieved successfully",
        data: bankers,
        error: null,
      });
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Error fetching bankers: ${err.message}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
        error: err.message,
      });
    }
  }
  async getBankerById(req: Request, res: Response): Promise<any> {
    try {
      const bankerId = req.params.id;

      if (!bankerId) {
        return res.status(400).json({
          success: false,
          message: "Banker ID is required in params",
          data: null,
          error: "Missing banker ID",
        });
      }

      const banker = await bankerRepository.getBankerById(bankerId);

      if (!banker) {
        return res.status(404).json({
          success: false,
          message: "Banker not found",
          data: null,
          error: "Not Found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Banker retrieved successfully",
        data: banker,
        error: null,
      });
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Error fetching banker: ${err.message}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
        error: err.message,
      });
    }
  }
}

export default new BankerController();
