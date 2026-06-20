// ./config/queue.ts
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// 💡 PRODUCTION UPGRADE: Automatically inject secure TLS rules if connecting to an external cloud database (Upstash)
const isCloudRedis = REDIS_URL.includes('upstash.io') || REDIS_URL.includes('rediss://');

export const connection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null, // Critical requirement for BullMQ
  ...(isCloudRedis && {
    tls: {
      rejectUnauthorized: false // Required for serverless cloud databases like Upstash over public TLS
    }
  })
});

// Pass the connection directly into the option block
export const assessmentQueue = new Queue('assessmentGeneration', {
  connection: connection as any, // 💡 Typecast to 'any' to bypass package-nesting version conflicts safely
  defaultJobOptions: {
    attempts: 3, 
    backoff: {
      type: 'exponential',
      delay: 2000, 
    },
  },
});

console.log(`🛑 Redis connection routing configured (Cloud Mode: ${isCloudRedis}). BullMQ initialized.`);