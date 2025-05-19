import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAddress extends Document {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  longitude: string;
  latitude: string;
  fullAddress: string;
  suiteNo: string;
  active: string;
  createdBy: Types.ObjectId;
  updatedby: Types.ObjectId;
}

const AddressSchema: Schema = new Schema<IAddress>(
  {
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    longitude: String,
    latitude: String,
    fullAddress: String,
    suiteNo: String,
    active: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedby: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    collection: "address"
  }
);

export const AddressModel = mongoose.model<IAddress>("address", AddressSchema);
