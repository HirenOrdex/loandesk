import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IBorrower extends Document {
  userId: Types.ObjectId;
  coname: string;
  position: string;
  picture: string;
  createdBy: Types.ObjectId;
  updatedby: Types.ObjectId;
}

const BorrowerSchema: Schema = new Schema<IBorrower>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    coname: { type: String, required: true },
    position: { type: String, required: true },
    picture: { type: String, required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedby: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const BorrowerModel = model<IBorrower>("Borrower", BorrowerSchema);
