import dotenv from "dotenv";
import logger from "../../common/logger";
import errorMiddleware from "../../common/error.middleware";
import { initializeDatabase, disconnectDatabase } from "../../common/database";
import { initializeKafka, disconnectKafka } from "../../common/kafka";
// BUG FIX: This file used to create its own bare `express()` instance with only
// helmet/cors/json middleware and a /health route, then listen() on it directly.
// It never imported or mounted the real application (routes, auth middleware,
// business logic) defined in ./app.ts. Since `node dist/server.js` is the actual
// process started by `npm start` and by the Dockerfile CMD, every request to any
// /api/auth/* endpoint returned a 404 in any real deployment - only /health
// worked. The Jest integration tests never caught this because they import
// ./app.ts directly (`import app from "../src/app"`), bypassing server.ts
// entirely. Importing the fully-configured app here (which already sets up its
// own helmet/cors/json/health-check) fixes this without changing its behavior.
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;

app.use(errorMiddleware);

const server = app.listen(PORT, async () => {
  try {
    await initializeDatabase();
    await initializeKafka();
    logger.info(`auth-service running on port ${PORT}`);
  } catch (error) {
    logger.error("Failed to initialize auth-service:", error);
    process.exit(1);
  }
});

const gracefulShutdown = async () => {
  logger.info("Shutting down auth-service...");
  server.close(async () => {
    try {
      await disconnectDatabase();
      await disconnectKafka();
      logger.info("auth-service shut down successfully");
      process.exit(0);
    } catch (error) {
      logger.error("Error during shutdown:", error);
      process.exit(1);
    }
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

export default server;
