import dotenv from "dotenv";
import logger from "./logger";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config();

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
