import { boolean } from "joi";
import { Schema, model, Document, Types } from "mongoose";

export interface IPerson extends Document {
  userId?: Types.ObjectId;
  addressId: Types.ObjectId;
  name: string;
  birthDate: Date;
  workPhone: string;
  email2: string;
  companyName: string;
  title: string;
  ssn: string;
  isUsCitizen: Boolean;
  profileimagepath: string;
  webURL: string;
  linkedinUrl: string;
  organizationstructureid: number;
  active: string;
  createdBy: Types.ObjectId;
  updatedby: Types.ObjectId;
}

const PersonSchema = new Schema<IPerson>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    addressId: { type: Schema.Types.ObjectId, ref: "Address" },
    name: { type: String, required: false },
    birthDate: { type: Date },
    workPhone: { type: String },
    email2: { type: String },
    companyName: { type: String },
    title: { type: String },
    ssn: { type: String },
    isUsCitizen: { type: Boolean, required: false },
    profileimagepath: { type: String },
    webURL: { type: String },
    linkedinUrl: { type: String },
    organizationstructureid: { type: Number },
    active: { type: String, required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedby: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to User model
  },
  {
    collection: "person",
    timestamps: true,
  }
);

export const Person = model<IPerson>("Person", PersonSchema);
