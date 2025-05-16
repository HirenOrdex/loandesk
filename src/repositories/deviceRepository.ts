import crypto from "crypto";
import { logger } from "../configs/winstonConfig";
import Device, { IDevice } from "../models/deviceModel";
import  { nodeCacheClient } from "../utils/nodeCacheClient";

interface DeviceInfo {
  deviceId: string;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  ipAddress?: string;
  userAgent?: string;
  lastUsed?: Date;
}

class DeviceRepository {
 // Store device info in cache for 5 minutes (300 seconds)
async storeTemporaryDeviceInfo(
  requestId: string,
  deviceInfo: DeviceInfo
): Promise<void> {
  try {
    nodeCacheClient.set(
      `device_${requestId}`,
      deviceInfo, // No need to stringify here, node-cache handles it
      300 // TTL in seconds
    );
  } catch (error) {
    logger.error(`DeviceRepository.storeTemporaryDeviceInfo error: ${error}`);
    throw error;
  }
}

// Retrieve device info from cache
async getTemporaryDeviceInfo(requestId: string): Promise<DeviceInfo | null> {
  try {
    const deviceInfo = await nodeCacheClient.get<DeviceInfo>(`device_${requestId}`);
    if (!deviceInfo) return null;
    return deviceInfo; // No need to parse, it's already an object
  } catch (error) {
    logger.error(`DeviceRepository.getTemporaryDeviceInfo error: ${error}`);
    throw error;
  }
}


  async saveDeviceInfo(
    userId: string,
    deviceInfo: DeviceInfo
  ): Promise<IDevice> {
    try {
      const existingDevice = await Device.findOne({
        userId,
        deviceId: deviceInfo.deviceId,
      });

      if (existingDevice) {
        existingDevice.deviceModel =
          deviceInfo.deviceModel || existingDevice.deviceModel;
        existingDevice.osVersion =
          deviceInfo.osVersion || existingDevice.osVersion;
        existingDevice.appVersion =
          deviceInfo.appVersion || existingDevice.appVersion;
        existingDevice.lastUsed = new Date();
        existingDevice.ipAddress =
          deviceInfo.ipAddress || existingDevice.ipAddress;
        existingDevice.userAgent =
          deviceInfo.userAgent || existingDevice.userAgent;

        await existingDevice.save();
        return existingDevice;
      } else {
        return await Device.create({
          userId,
          deviceId: deviceInfo.deviceId,
          deviceModel: deviceInfo.deviceModel,
          osVersion: deviceInfo.osVersion,
          appVersion: deviceInfo.appVersion,
          ipAddress: deviceInfo.ipAddress,
          userAgent: deviceInfo.userAgent,
          lastUsed: new Date(),
          isActive: true,
        });
      }
    } catch (error) {
      logger.error(`DeviceRepository.saveDeviceInfo error: ${error}`);
      throw error;
    }
  }

  async getUserDevices(userId: string): Promise<IDevice[]> {
    try {
      return await Device.find({ userId, isActive: true });
    } catch (error) {
      logger.error(`DeviceRepository.getUserDevices error: ${error}`);
      throw error;
    }
  }

  async deactivateDevice(userId: string, deviceId: string): Promise<void> {
    try {
      await Device.findOneAndUpdate({ userId, deviceId }, { isActive: false });
    } catch (error) {
      logger.error(`DeviceRepository.deactivateDevice error: ${error}`);
      throw error;
    }
  }

  async verifyDeviceForUser(
    userId: string,
    deviceInfo: DeviceInfo
  ): Promise<boolean> {
    try {
      const device = await Device.findOne({
        userId,
        deviceId: deviceInfo.deviceId,
        isActive: true,
      });

      return !!device;
    } catch (error) {
      logger.error(`DeviceRepository.verifyDeviceForUser error: ${error}`);
      throw error;
    }
  }

  async getDeviceById(
    userId: string,
    deviceId: string
  ): Promise<IDevice | null> {
    try {
      return await Device.findOne({ userId, deviceId });
    } catch (error) {
      logger.error(`DeviceRepository.getDeviceById error: ${error}`);
      throw error;
    }
  }
}

export default new DeviceRepository();
