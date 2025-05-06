// src/models/BankerRegistration.ts
import { Schema, model, Document } from 'mongoose';

export interface IBankerRegistration extends Document {
  financialInstitutionName: string;
  email: string;
  password: string;
  firstName: string;
  middleInitial?: string;
  lastName: string;
  phone: string;
  title?: string;
  areaOfSpecialty?: string;
  address: string;
  bankType?: string;
  assetSize?: string;
}

const bankerRegistrationSchema = new Schema<IBankerRegistration>(
  {
    financialInstitutionName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },
    firstName: { type: String, required: true },
    middleInitial: { type: String },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    title: { type: String, required: true },
    areaOfSpecialty: { type: String, required: true },
    address: { type: String, required: true },
    bankType: { type: String, required: true },
    assetSize: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const BankerRegistrationModel = model<IBankerRegistration>('BankerRegistration', bankerRegistrationSchema);
export default BankerRegistrationModel;
