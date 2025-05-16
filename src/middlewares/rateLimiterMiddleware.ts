import { Request, Response, NextFunction } from 'express';
import nodeCacheClient from '../utils/nodeCacheClient';
import { extractDeviceInfo } from '../utils/deviceUtils';
import { logger } from '../configs/winstonConfig';

interface RateLimiterOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum number of requests in the time window
  message?: string; // Custom error message
  keyGenerator?: (req: Request) => string; // Custom key generator
}

export const rateLimiter = (options: RateLimiterOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deviceInfo = extractDeviceInfo(req);
      
      // Generate a key based on IP and device ID (or just IP if device ID is not available)
      const key = `ratelimit:${req.path}:${deviceInfo.ipAddress}:${deviceInfo.deviceId || 'unknown'}`;
      
      // Get current count
      const current = await nodeCacheClient.get(key);
      const count = current ? parseInt(current.toString(), 10) : 0; // Ensure we are passing a string to parseInt
      
      // Check if limit is exceeded
      if (count >= options.max) {
        logger.warn(`Rate limit exceeded for ${key}`);

        return res.status(429).json({
          status: "error",
          message:
            options.message || "Too many requests, please try again later.",
        });
      }

      // Increment count
      if (count === 0) {
        // First request in the window
        nodeCacheClient.set(key, 1, Math.floor(options.windowMs / 1000)); // TTL in seconds
      } else {
        // Increment existing count
        const currentCount = await nodeCacheClient.get<number>(key) || 0; // Get current count
        nodeCacheClient.set(
          key,
          currentCount + 1,
          Math.floor(options.windowMs / 1000)
        ); // TTL in seconds
      }
      next();
    } catch (error) {
      logger.error('Error in rate limiter middleware:', error);
      next(); // Continue even if there's an error with rate limiting
    }
  };
};
;