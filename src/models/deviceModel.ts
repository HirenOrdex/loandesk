// src/models/deviceModel.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IDevice extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId: string;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  ipAddress?: string;
  userAgent?: string;
  lastUsed: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const deviceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceId: {
    type: String,
    required: [true, 'Device ID is required'],
    index: true
  },
  deviceModel: {
    type: String
  },
  osVersion: {
    type: String
  },
  appVersion: {
    type: String
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  lastUsed: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for faster lookups
deviceSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

const Device = mongoose.model<IDevice>('Device', deviceSchema);

export default Device;