// src/models/BankerRegistration.ts
import { Schema, model, Document } from "mongoose";

export interface IBankerRegistration extends Document {
  financialInstitutionName: string;
  title?: string;
  areaOfSpecialty?: string;
  address: string;
  bankType?: string;
  assetSize?: string;
  userId?: string;
}

const bankerRegistrationSchema = new Schema<IBankerRegistration>(
  {
    financialInstitutionName: { type: String, required: true },
    title: { type: String, required: true },
    areaOfSpecialty: { type: String, required: true },
    address: { type: String, required: true },
    bankType: { type: String, required: true },
    assetSize: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  },
  {
    timestamps: true,
  }
);

const BankerRegistrationModel = model<IBankerRegistration>(
  "BankerRegistration",
  bankerRegistrationSchema
);
export default BankerRegistrationModel;
