import { Schema, model, Document, Types } from "mongoose";

export interface IPerson extends Document {
  userId?: Types.ObjectId;
  addressId: Types.ObjectId;
  firstname: string;
  middelname: string;
  lastname: string;
  birthdate: Date;
  contact1: string;
  contact2: string;
  email1: string;
  email2: string;
  companyname: string;
  title: string;
  ssn: string;
  isuscitizen: string;
  profileimagepath: string;
  websiteurl: string;
  linkedinurl: string;
  organizationstructureid: number;
  active: string;
  createdBy: Types.ObjectId;
  updatedby: Types.ObjectId;
}

const PersonSchema = new Schema<IPerson>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    addressId: { type: Schema.Types.ObjectId, ref: "Address" },
    firstname: { type: String, required: true },
    middelname: { type: String },
    lastname: { type: String, required: true },
    birthdate: { type: Date },
    contact1: { type: String },
    contact2: { type: String },
    email1: { type: String },
    email2: { type: String },
    companyname: { type: String },
    title: { type: String },
    ssn: { type: String },
    isuscitizen: { type: String },
    profileimagepath: { type: String },
    websiteurl: { type: String },
    linkedinurl: { type: String },
    organizationstructureid: { type: Number },
    active: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedby: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to User model
  },
  {
    collection: "persons",
    timestamps: true,
  }
);

export const Person = model<IPerson>("Person", PersonSchema);
