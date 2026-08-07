import dotenv from "dotenv";
import logger from "./logger";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config();

// BUG FIX: `new PrismaClient()` was previously called eagerly at module scope,
// which runs the instant this file is imported - before initializeDatabase()
// (or its try/catch) ever executes. If the Prisma client hasn't been generated
// for the running environment, the constructor throws synchronously, so simply
// importing common/database.ts (as every server.ts does) crashes the process
// on startup with no chance to log a clean error or let the app serve
// unrelated routes like /health. Instantiating lazily inside
// initializeDatabase() (matching the pattern already used by
// integration-service/multi-tenant-service/realtime-analytics-service's own
// config/database.ts) turns that hard crash into a caught, loggable failure.
let prisma: PrismaClient;

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

// Initialize database connection
export const initializeDatabase = async (): Promise<void> => {
  try {
    const client = getPrismaClient();
    // Test connection by querying the database
    await client.$connect();
    logger.info("Database connection established");
  } catch (error) {
    logger.error("Failed to connect to database:", error);
    throw error;
  }
};

// Disconnect from database
export const disconnectDatabase = async (): Promise<void> => {
  try {
    if (prisma) {
      await prisma.$disconnect();
    }
    logger.info("Database connection closed");
  } catch (error) {
    logger.error("Failed to disconnect from database:", error);
    throw error;
  }
};

export default {
  get prisma(): PrismaClient {
    return getPrismaClient();
  },
  initializeDatabase,
  disconnectDatabase,
  getPrismaClient,
};
