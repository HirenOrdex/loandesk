// src/utils/deviceUtils.ts
import { Request } from 'express';
import useragent from 'useragent';

/**
 * Extracts device information from request headers
 * @param req Express Request object
 * @returns Device information object
 */
export const extractDeviceInfo = (req: Request): {
  deviceId: string;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  ipAddress?: string;
  userAgent?: string;
} => {
  // Get IP address
  const ipAddress = 
    req.headers['x-forwarded-for'] as string || 
    req.socket.remoteAddress || 
    '';
  
  // Get User-Agent
  const userAgentString = req.headers['user-agent'] || '';
  
  // Parse user agent
  const agent = useragent.parse(userAgentString);
  
  // Get device ID - prefer the one from headers, fallback to fingerprint or generate one
  const deviceId = 
    (req.headers['x-device-id'] as string) || 
    (req.headers['x-fingerprint'] as string) || 
    generateDeviceId(req);
  
  // Get app version
  const appVersion = req.headers['x-app-version'] as string || undefined;
  
  // Construct device info
  return {
    deviceId,
    deviceModel: `${agent.device.family} ${agent.device.major || ''}`.trim(),
    osVersion: `${agent.os.family} ${agent.os.major || ''}`.trim(),
    appVersion,
    ipAddress,
    userAgent: userAgentString.toString()
  };
};

/**
 * Generates a device ID based on request information
 * @param req Express Request object
 * @returns A generated device ID
 */
const generateDeviceId = (req: Request): string => {
  const userAgent = req.headers['user-agent'] || '';
  const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';
  
  // Create a fingerprint based on available data
  const fingerprint = `${userAgent}-${ip}-${Date.now()}`;
  
  // Generate a hash of the fingerprint
  const crypto = require('crypto');
  return crypto.createHash('md5').update(fingerprint).digest('hex');
};

/**
 * Extracts specific info about the device from user agent
 * @param userAgent User agent string
 * @returns Device information
 */
export const parseDeviceInfo = (userAgent: string) => {
  const agent = useragent.parse(userAgent);
  
  return {
    browser: agent.toAgent(),
    os: agent.os.toString(),
    device: agent.device.toString(),
    isMobile: agent.device.family !== 'Other'
  };
};