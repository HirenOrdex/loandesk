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
  active: boolean;
  createdBy: Types.ObjectId;
  updatedby: Types.ObjectId;
}

const DealDataRequestSchema = new Schema<IDealDataRequest>(
  {
    referenceNo: { type: String, required: false },
    borrowerId: { type: Schema.Types.ObjectId, ref: "Person", required: false },
    borrowerType: { type: String, required: false },
    borrowerCompanyId: { type: Schema.Types.ObjectId, ref: "borrowerCompany" },
    bankerId: { type: Schema.Types.ObjectId, ref: "Person", required: false },
    noOfLoans: { type: Number, required: false },
    appSkip: { type: Number, required: false },
    currentStep: { type: Number, required: false },
    requestedDate: { type: Date, required: false },
    channel: { type: String, required: false },
    initiatedBy: { type: String, required: false },
    saveStatus: {
      type: String,
      enum: [
        'DRAFT',
        'INPROGRESS',
        'INACTIVE',
        'COMPLETE',
        'PROPOSAL ISSUED',
        'DEAL DECLINED',
        'DEAL FUNDED',
        'READY TO PARSE',
        'ACCESSIBLE',
        'DEAL COMPLETED'
      ],
      default: 'DRAFT',
      required: false,
    },
    fundedDate: { type: Date },
    organizationStructureId: { type: Number, required: false },
    isParsing: { type: String },
    parsingStartTime: { type: Date },
    deleteReason: { type: String },
    dealType: { type: String, required: false },
    parsingType: { type: String },
    active: { type: Boolean, required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedby: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to User model
  },
  {
    collection: "dealDataRequest",
    timestamps: true,
  }
);

export const DealDataRequest = model<IDealDataRequest>(
  "DealDataRequest",
  DealDataRequestSchema
);
