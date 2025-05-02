// src/models/User.ts
import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserDocument } from '../types/userType';

export interface IUser extends Document {
  // changedPasswordAfter?: Date;
  company_id?: Types.ObjectId;
  _id: any;
  firstName: string;
  lastName: string;
  email?: string;
  password?: string;
  role: string;
  active: boolean;
  status:string;
  refreshToken?: string | null;
  loginAttempts: number;
  lastLoginAttempt?: Date;
  phone?:string;
  // passwordResetToken?: string | null;
  // passwordResetExpires?: Date | undefined | null;
  passwordChangedAt?:Date;
  // emailVerificationToken?:string | null;
  correctPassword(candidatePassword: string): Promise<boolean>;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  // emailVerificationExpires?:Date | null;
}

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: [false, 'Email is required'],
      lowercase: true
    },
    password: {
      type: String,
      required: [false, 'Password is required'],
      minlength: 8,
      select: false
    },
    status: {
      type: String,
      enum: ['active', 'inactive','pending','deleted'],
      default: 'active'
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    active: {
      type: Boolean,
      default: true
    },
    refreshToken: {
      type: String,
      select: false
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    // passwordResetToken: {
    //   type: String,
    //   select: false
    // },
    isPhoneVerified: {
      type: Boolean,
      default: false
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    phone:{
      type:String,
      default: false
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
    lastLoginAttempt: {
      type: Date,
      select: false
    },
    company_id: {
      type: Schema.Types.ObjectId,
      ref: 'Company', // This should match the name used in CompanyModel
      required: false,
    },
    streamToken: { type: String },
    streamUserId: { type: String }
    
  },
  {
    timestamps: true
  }
);

/**
 * Method to compare candidate password with user's hashed password
 */
userSchema.index({ company_id: 1, email: 1 }, { unique: true });
userSchema.methods.correctPassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = model<UserDocument>('User', userSchema);
export default UserModel;