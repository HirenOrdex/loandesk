// src/models/BankerRegistration.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IBankerRegistration extends Document {
  financialInstitutionName: string;
  title?: string;
  areaOfSpecialty?: string;
  addressId: Types.ObjectId;
  bankType?: string;
  assetSize?: string;
  createdBy: Types.ObjectId;
  updatedby: Types.ObjectId;
  userId?: string;
}

const bankerSchema = new Schema<IBankerRegistration>(
  {
    financialInstitutionName: { type: String, required: true },
    title: { type: String, required: true },
    areaOfSpecialty: { type: String, required: true },
    addressId: { type: Schema.Types.ObjectId, ref: "Address" },
    bankType: { type: String, required: true },
    assetSize: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedby: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to User model
  },
  {
    timestamps: true,
  }
);

const BankerModel = model<IBankerRegistration>("banker", bankerSchema);
export default BankerModel;
