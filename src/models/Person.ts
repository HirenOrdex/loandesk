import { Schema, model, Document, Types } from "mongoose";

export interface IPerson extends Document {
  userid: Types.ObjectId;
  workPhone?: string;
  email2?: string;
   webURL?: string;
  linkedinurl?: string;
  addressId: Types.ObjectId;
  createdby: string;
  updatedby: string;
}

const personSchema = new Schema<IPerson>(
  {
    userid: { type: Schema.Types.ObjectId, required: true },
    workPhone: { type: String },
    email2: { type: String },
    webURL: { type: String },
    linkedinurl: { type: String },
    addressId: { type: Schema.Types.ObjectId, required: true },
    createdby: { type: String },
    updatedby: { type: String },
  },
  {
    timestamps: true,
  }
);

const PersonModel = model<IPerson>("Persons", personSchema);
export default PersonModel;
