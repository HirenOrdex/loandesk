// src/services/redisService.ts
import redisClient from '../utils/redisClient';

class RedisService {
  /**
   * Set a key with optional TTL (in seconds)
   */
  async set<T>(key: string, value: T, ttlInSeconds = 3600): Promise<void> {
    const serializedValue = JSON.stringify(value);
    await redisClient.set(key, serializedValue, {
      EX: ttlInSeconds
    });
  }

  /**
   * Get a value by key
   */
  async get<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  /**
   * Delete a key
   */
  async del(key: string): Promise<void> {
    await redisClient.del(key);
  }

  /**
   * Check if a key exists
   */
  async exists(key: string): Promise<boolean> {
    const exists = await redisClient.exists(key);
    return exists === 1;
  }

  /**
   * Set a value only if key does not exist (NX)
   */
  async setIfNotExists<T>(key: string, value: T, ttlInSeconds = 3600): Promise<boolean> {
    const result = await redisClient.set(key, JSON.stringify(value), {
      NX: true,
      EX: ttlInSeconds
    });
    return result === 'OK';
  }
}

export const redisService = new RedisService();
