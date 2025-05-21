
import { Schema, model, Document, Types } from "mongoose";

export interface IGuarantor extends Document {
  borrowerCompanyId: Types.ObjectId;
  userId:Types.ObjectId;
  isGuarantor: number;
  percentageOfOwnership: number;
  numberOfCOI: number;
  active: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  dealDataReqId: Types.ObjectId;
  addressId: Types.ObjectId

}

const guarantorSchema = new Schema<IGuarantor>(
  {
    borrowerCompanyId: { type: Schema.Types.ObjectId, ref:"BorrowerCompany" },
    isGuarantor: { type: Number, required: true },
    dealDataReqId: {
      type: Schema.Types.ObjectId,
      ref: "DealDataRequest",
      required: true,
    },
    addressId: { type: Schema.Types.ObjectId, ref: "Address" },
    percentageOfOwnership: { type: Number, required: true },
    numberOfCOI: { type: Number, required: true },
    active: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    collection: "guarantor",
    timestamps: true,
  }
);

const GuarantorModel = model<IGuarantor>("guarantor", guarantorSchema);
export default GuarantorModel;
