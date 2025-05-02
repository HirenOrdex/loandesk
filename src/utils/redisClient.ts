// src/utils/redisClient.ts
import { createClient } from 'redis';
import { REDIS_URL } from '../configs/envConfigs';


export const redisClient = createClient({
  url: REDIS_URL
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Redis connection error:', error);
    // Retry connection after 5 seconds
    setTimeout(connectRedis, 5000);
  }
};

export default redisClient;
