import dotenv from "dotenv";
import logger from "../../common/logger";
import errorMiddleware from "../../common/error.middleware";
import { initializeDatabase, disconnectDatabase } from "../../common/database";
import { initializeKafka, disconnectKafka } from "../../common/kafka";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 4003;

app.use(errorMiddleware);

const server = app.listen(PORT, async () => {
  try {
    await initializeDatabase();
  } catch (error) {
    logger.error(
      "Failed to initialize database for accounting-service:",
      error,
    );
    process.exit(1);
  }

  // Kafka is best-effort; a broker outage should not take down the service.
  try {
    await initializeKafka();
    logger.info(`accounting-service running on port ${PORT}, Kafka connected`);
  } catch (error) {
    logger.warn(
      `accounting-service running on port ${PORT} WITHOUT Kafka - event publishing is disabled:`,
      error,
    );
  }
});

const gracefulShutdown = async () => {
  logger.info("Shutting down accounting-service...");
  server.close(async () => {
    try {
      await disconnectDatabase();
      await disconnectKafka();
      logger.info("accounting-service shut down successfully");
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
