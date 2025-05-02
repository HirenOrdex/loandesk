import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../utils/redisClient';
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
      const current = await redisClient.get(key);
      const count = current ? parseInt(current, 10) : 0;
      
      // Check if limit is exceeded
      if (count >= options.max) {
        logger.warn(`Rate limit exceeded for ${key}`);
        
        return res.status(429).json({
          status: 'error',
          message: options.message || 'Too many requests, please try again later.',
        });
      }
      
      // Increment count
      if (count === 0) {
        // First request in the window
        await redisClient.set(key, '1', { EX: Math.floor(options.windowMs / 1000) });
      } else {
        // Increment existing count
        await redisClient.incr(key);
      }
      
      next();
    } catch (error) {
      logger.error('Error in rate limiter middleware:', error);
      next(); // Continue even if there's an error with rate limiting
    }
  };
};