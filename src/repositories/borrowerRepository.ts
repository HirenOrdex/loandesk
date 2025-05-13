import { IBorrower, BorrowerModel } from "../models/BorrowerModel";

export class BorrowerRepository {
  async createBorrower(data: Partial<IBorrower>): Promise<IBorrower> {
    const borrower = await BorrowerModel.create(data);
    return borrower;
  }

  // (Optional) add more methods here like getBorrowerById, updateBorrower, etc.
}
