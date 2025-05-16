import { Schema, model, Document, Types } from "mongoose";

export interface IDealDataStructure extends Document {
  dealDataReqId: Types.ObjectId;
  loanType: string;
  loanAmount: number;
  rate: number;
  amortization: number;
  paymentType: string;
  sba: string;
  term: number;
  active: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  updatedFlag: string;
}

const DealDataStructureSchema = new Schema<IDealDataStructure>(
  {
    dealDataReqId: {
      type: Schema.Types.ObjectId,
      ref: "DealDataRequest",
      required: true,
    },
    loanType: {
      type: String,
      required: true,
    },
    loanAmount: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    amortization: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
    },
    sba: {
      type: String,
      required: true,
    },
    term: {
      type: Number,
      required: true,
    },
    active: {
      type: String,
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to User model

    updatedFlag: {
      type: String,
      required: true,
    },
  },
  {
    collection: "dealDataStructure",
    timestamps: true,
  }
);

export const DealDataStructure = model<IDealDataStructure>(
  "DealDataStructure",
  DealDataStructureSchema
);
