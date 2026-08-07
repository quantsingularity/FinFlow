import dotenv from "dotenv";
import logger from "../../common/logger";
import errorMiddleware from "../../common/error.middleware";
import { initializeDatabase, disconnectDatabase } from "../../common/database";
import { initializeKafka, disconnectKafka } from "../../common/kafka";
// BUG FIX: See auth-service/src/server.ts for the full explanation - this file
// created a bare `express()` instance and never mounted the real routes/
// middleware defined in ./app.ts, so the actual deployed process (Docker CMD /
// `npm start` both run dist/server.js) 404'd on every /api/payments/* route -
// including payment processing itself.
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 4002;

app.use(errorMiddleware);

const server = app.listen(PORT, async () => {
  try {
    await initializeDatabase();
    await initializeKafka();
    logger.info(`payments-service running on port ${PORT}`);
  } catch (error) {
    logger.error("Failed to initialize payments-service:", error);
    process.exit(1);
  }
});

const gracefulShutdown = async () => {
  logger.info("Shutting down payments-service...");
  server.close(async () => {
    try {
      await disconnectDatabase();
      await disconnectKafka();
      logger.info("payments-service shut down successfully");
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
