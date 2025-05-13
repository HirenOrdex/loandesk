import { ObjectId } from "mongoose";

export interface UpdateUser {
  _id: ObjectId | string;
  firstName: string;
  lastName: string;
  email: string;
  status: "active" | "inactive" | string;
  role: "user" | "admin" | string;
  active: boolean;
  loginAttempts: number;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
  password?: string; // Optional, only selected explicitly
}

