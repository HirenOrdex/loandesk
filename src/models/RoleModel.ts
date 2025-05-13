import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IRole extends Document {
  roleid: number;
  rolename: string;
  active: string;
  createdby: Types.ObjectId;
  updatedby: Types.ObjectId;
}

const RoleSchema: Schema = new Schema<IRole>(
  {
    roleid: { type: Number, required: true },
    rolename: { type: String, required: true },
    active: { type: String, default: "Y" },
    createdby: { type: Schema.Types.ObjectId, ref: "User" },
    updatedby: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const RoleModel = model<IRole>("role", RoleSchema);
