import { Schema, model, Document, Types } from "mongoose";

export interface IPerson extends Document {
  userId: Types.ObjectId;
  workPhone?: string;
  email2?: string;
  suiteNo?:string;
  webUrl?: string;
  linkedinUrl?: string;
  addressId: Types.ObjectId;
  profileImage?: string;
  createdBy: string;
  updatedBy: string;
}

const personSchema = new Schema<IPerson>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    workPhone: { type: String },
    email2: { type: String },
    webUrl: { type: String },
    suiteNo: { type: String },
    linkedinUrl: { type: String },
    addressId: { type: Schema.Types.ObjectId, required: true },
    profileImage: { type: String },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
    collection:"person"
  }
);

const PersonModel = model<IPerson>("person", personSchema);
export default PersonModel;
