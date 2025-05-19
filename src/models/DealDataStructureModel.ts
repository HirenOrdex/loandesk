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
      required: false,
    },
    loanType: {
      type: String,
      required: false,
    },
    loanAmount: {
      type: Number,
      required: false,
    },
    rate: {
      type: Number,
      required: false,
    },
    amortization: {
      type: Number,
      required: false,
    },
    paymentType: {
      type: String,
      required: false,
    },
    sba: {
      type: String,
      required: false,
    },
    term: {
      type: Number,
      required: false,
    },
    active: {
      type: String,
      required: false,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to User model

    updatedFlag: {
      type: String,
      required: false,
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
