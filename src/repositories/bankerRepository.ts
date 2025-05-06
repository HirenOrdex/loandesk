import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User, { IUser } from '../models/User';
import { UserDocument } from '../types/userType';
import redisClient from '../utils/redisClient';
import { hashToken } from '../utils/emailUtils';
import { logger } from '../configs/winstonConfig';
import BankerRegistrationModel from '../models/BankerModel';

export class BankerRepossitory {
 
  async createBanker(bankerData: any)  {
    try {
      const newBanker = await BankerRegistrationModel.create(bankerData);
      return { id: newBanker._id };
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Error creating banker: ${err.message}`);
      logger.error(`Error creating banker: ${err.message}`);
      throw new Error(`Error creating banker: ${err.message}`);
    }
  };
  async updateBanker(bankerId: string, updateData:any) {
    try {
      const updatedBanker = await BankerRegistrationModel.findByIdAndUpdate(
        bankerId,
        updateData
      );
  
      if (!updatedBanker) {
        throw new Error('Banker not found');
      }
  
      return { id: updatedBanker._id };
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Error updating banker: ${err.message}`);
      logger.error(`Error updating banker: ${err.message}`);
      throw new Error(`Error updating banker: ${err.message}`);
    }
  }
  
  async hashPassword(password: string) {
    try {
        return await bcrypt.hash(password, 12);
    } catch (error: unknown) {
        const err = error as Error;
        console.error(`Error hashing password: ${err.message}`);
        logger.error(`Error hashing password: ${err.message}`);
        throw new Error(`Error hashing password: ${err.message}`);
    }
}}