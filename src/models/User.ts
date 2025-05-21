// src/models/User.ts
import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { UserDocument } from "../types/userType";

export interface IUser extends Document {
  // changedPasswordAfter?: Date;
  _id: Types.ObjectId;
  firstName: string;
  middleInitial?: string;
  lastName: string;
  email?: string;
  password?: string;
  roleId?: Types.ObjectId;
  active: boolean;
  status: string;
  refreshToken?: string | null;
  loginAttempts: number;
  lastLoginAttempt?: Date;
  phone?: string;
  // passwordResetToken?: string | null;
  // passwordResetExpires?: Date | undefined | null;
  passwordChangedAt?: Date;
  createdBy: Types.ObjectId;
  updatedby: Types.ObjectId;
  // emailVerificationToken?:string | null;
  correctPassword(candidatePassword: string): Promise<boolean>;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  otp?:string
  // emailVerificationExpires?:Date | null;
}

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    middleInitial: { type: String, required: false },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: [false, "Email is required"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [false, "Password is required"],
      minlength: 8,
      select: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "deleted"],
      default: "active",
    },
    roleId: { type: Schema.Types.ObjectId, ref: "Role" },
    active: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    otp: {
      type: String,
      select: false,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    // passwordResetToken: {
    //   type: String,
    //   select: false
    // },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: false,
    },
    // emailVerificationToken:{
    //   type:String,
    //   default: false
    // },
    // emailVerificationExpires:{
    //   type: Date,
    //   select: false
    // },
    // passwordResetExpires: {
    //   type: Date,
    //   select: false
    // },
    // passwordChangedAt: {
    //   type: Date,
    //   select: false
    // },
    //  address: {
    //   type: String,
    //   default: "",
    // },
    lastLoginAttempt: {
      type: Date,
      select: false,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedby: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    collection: "user", 
  }
);

/**
 * Method to compare candidate password with user's hashed password
 */
// userSchema.index({ email: 1 });
userSchema.methods.correctPassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = model<UserDocument>("User", userSchema);
export default UserModel;
