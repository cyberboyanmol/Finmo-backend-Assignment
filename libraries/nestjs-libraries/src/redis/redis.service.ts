import { Redis } from 'ioredis';

export const ioRedisClient = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});
