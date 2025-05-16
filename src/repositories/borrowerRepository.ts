import { IBorrower, BorrowerModel } from "../models/BorrowerModel";

export class BorrowerRepository {
  async createBorrower(data: Partial<IBorrower>): Promise<IBorrower> {
    const borrower = await BorrowerModel.create(data);
    return borrower;
  }

   async findBorrowerByUserId(userId: string): Promise<IBorrower | null> {
    return await BorrowerModel.findOne({ userId }).populate('userId');
  }

  async updateBorrowerByUserId(userId: string, updateData: Partial<IBorrower>) {
  return await BorrowerModel.findOneAndUpdate({ userId }, updateData, { new: true });
}

  // (Optional) add more methods here like getBorrowerById, updateBorrower, etc.
}
