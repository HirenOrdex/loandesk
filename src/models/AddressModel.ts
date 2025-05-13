import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAddress extends Document {
  addressid: number;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  longitude: string;
  latitude: string;
  fulladdress: string;
  suiteno: string;
  active: string;
  createdby: Types.ObjectId;
  updatedby: Types.ObjectId;
}

const AddressSchema: Schema = new Schema<IAddress>(
  {
    addressid: Number,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    longitude: String,
    latitude: String,
    fulladdress: String,
    suiteno: String,
    active: String,
    createdby: { type: Schema.Types.ObjectId, ref: "User" },
    updatedby: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const AddressModel = mongoose.model<IAddress>("address", AddressSchema);
