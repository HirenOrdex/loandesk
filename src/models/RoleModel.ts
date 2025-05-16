import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IRole extends Document {
  roleId: number;
  roleName: string;
  active: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

const RoleSchema: Schema = new Schema<IRole>(
  {
    roleId: { type: Number, required: true },
    roleName: { type: String, required: true },
    active: { type: String, default: "Y" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    collection: "role", 
  }
);

export const RoleModel = model<IRole>("role", RoleSchema);
