import { Schema, model, Document, Types } from "mongoose";

export interface IBorrowerCompany extends Document {
  companyName: string;
  legalEntity: string;
  businessPhone: string;
  website: string;
  addressId: Types.ObjectId;
  suite?: string;
  isDelete: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

const borrowerCompanySchema = new Schema<IBorrowerCompany>(
  {
    companyName: { type: String, required: true },
    legalEntity: { type: String, required: true },
    businessPhone: { type: String, required: true },
    website: { type: String },
    addressId: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    suite: { type: String },
    isDelete: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
  },
  {
    collection: "borrowerCompany",
    timestamps: true,
  }
);

const BorrowerCompanyModel = model<IBorrowerCompany>("borrowerCompany", borrowerCompanySchema);
export default BorrowerCompanyModel;
