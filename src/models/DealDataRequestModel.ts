import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IDealDataRequest extends Document {
  referenceNo: string;
  borrowerId: Types.ObjectId;
  borrowerType: string;
  borrowerCompanyId: Types.ObjectId;
  bankerId: Types.ObjectId;
  noOfLoans: number;
  appSkip: number;
  currentStep: number;
  requestedDate: Date;
  channel: string;
  initiatedBy: string;
  saveStatus: string;
  fundedDate: Date;
  organizationStructureId: number;
  isParsing: string;
  parsingStartTime: Date;
  deleteReason: string;
  dealType: string;
  parsingType: string;
  active: string;
  createdBy: Types.ObjectId;
  updatedby: Types.ObjectId;
}

const DealDataRequestSchema = new Schema<IDealDataRequest>(
  {
    referenceNo: { type: String, required: true },
    borrowerId: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    borrowerType: { type: String, required: true },
    borrowerCompanyId: { type: Schema.Types.ObjectId, ref: "borrowerCompany" },
    bankerId: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    noOfLoans: { type: Number, required: true },
    appSkip: { type: Number, required: true },
    currentStep: { type: Number, required: true },
    requestedDate: { type: Date, required: false },
    channel: { type: String, required: true },
    initiatedBy: { type: String, required: true },
    saveStatus: { type: String, required: true },
    fundedDate: { type: Date },
    organizationStructureId: { type: Number, required: true },
    isParsing: { type: String },
    parsingStartTime: { type: Date },
    deleteReason: { type: String },
    dealType: { type: String, required: true },
    parsingType: { type: String },
    active: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedby: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to User model
  },
  {
    collection: "dealdatarequest",
    timestamps: true,
  }
);

export const DealDataRequest = model<IDealDataRequest>(
  "DealDataRequest",
  DealDataRequestSchema
);
