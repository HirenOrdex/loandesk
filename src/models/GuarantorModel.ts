
import { Schema, model, Document, Types } from "mongoose";

export interface IGuarantor extends Document {
  borrowerCompanyId: number;
  personId: number;
  isGuarantor: number;
  percentageOfOwnership: number;
  numberOfCOI: number;
  active: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

const guarantorSchema = new Schema<IGuarantor>(
  {
    borrowerCompanyId: { type: Number, required: true },
    personId: { type: Number, required: true },
    isGuarantor: { type: Number, required: true },
    percentageOfOwnership: { type: Number, required: true },
    numberOfCOI: { type: Number, required: true },
    active: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User"},
    updatedBy: { type: Schema.Types.ObjectId, ref: "User"},
  },
  {
    timestamps: true, // You are providing manual createdDate/updatedDate as strings
  }
);

const GuarantorModel = model<IGuarantor>("guarantor", guarantorSchema);
export default GuarantorModel;
