// types/userType.ts or interfaces/user.interface.ts

import { Document, Types } from "mongoose";

export interface CompanyInfo {
  _id: Types.ObjectId;
  name: string;
  logoUrl: string | null;
  industry: string;
  createdAt: Date;
  updatedAt: Date;
}

// This is your schema shape
export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  role: "user" | "admin" | "superadmin";
  active: boolean;
  status: "active" | "inactive" | "pending" | "deleted";
  loginAttempts: number;
  lastFailedLoginAt?: Date;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  refreshToken?: string | null;
  company?: CompanyInfo | null;
  createdAt: Date;
  updatedAt: Date;
}

// This is what Mongoose returns
export interface UserDocument extends Document<Types.ObjectId>, IUser {
  _id: Types.ObjectId;
  correctPassword(candidatePassword: string): Promise<boolean>;
}
