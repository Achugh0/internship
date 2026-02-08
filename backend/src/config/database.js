import pg from 'pg';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import logger from '../utils/logger.js';

const { Pool } = pg;

// PostgreSQL - optional, will skip if not available
export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const connectPostgres = async () => {
  try {
    await pgPool.query('SELECT NOW()');
    logger.info('PostgreSQL connected');
  } catch (error) {
    logger.warn('PostgreSQL not available, some features will be limited:', error.message);
  }
};

// MongoDB - optional, will skip if not available
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    logger.info('MongoDB connected');
  } catch (error) {
    logger.warn('MongoDB not available, using in-memory storage:', error.message);
  }
};

// Redis - optional, will skip if not available
export const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    connectTimeout: 5000
  }
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Redis connected');
  } catch (error) {
    logger.warn('Redis not available, caching disabled:', error.message);
  }
};

redisClient.on('error', (err) => logger.debug('Redis error:', err.message));
