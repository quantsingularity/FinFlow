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

  // Kafka is treated as best-effort: local dev (start_services.sh) does not
  // run Zookeeper/Kafka, and a service that can reach its database has no
  // real reason to refuse HTTP traffic just because the event bus is down.
  // This previously shared the same try/catch as initializeDatabase(), so a
  // Kafka connection failure (the normal case locally) called process.exit(1)
  // ~20-30 seconds after the health check had already reported the service
  // ready - it would pass its health check and then silently die once
  // Kafka's retry budget (kafkaConfig.retry.retries) was exhausted.
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
