import dotenv from "dotenv";
import logger from "./logger";
import { Kafka, Producer, Consumer, KafkaConfig, ITopicConfig } from "kafkajs"; // Added ITopicConfig

// Load environment variables
dotenv.config();

/**
 * Kafka Configuration
 */
const kafkaConfig: KafkaConfig = {
  clientId:
    process.env.KAFKA_CLIENT_ID ||
    process.env.SERVICE_NAME ||
    "finflow-service",
  // Split brokers string into an array, defaults to localhost:9092
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
};

// Create Kafka instance
const kafka = new Kafka(kafkaConfig);

// Create producer and consumer instances
const producer: Producer = kafka.producer();
const consumer: Consumer = kafka.consumer({
  groupId:
    process.env.KAFKA_GROUP_ID ||
    `${process.env.SERVICE_NAME || "finflow"}-group`,
});

/**
 * Initializes Kafka producer and consumer connections.
 * @returns {Promise<void>}
 */
export const initializeKafka = async (): Promise<void> => {
  try {
    // Connect producer
    await producer.connect();
    logger.info("✅ Kafka producer connected successfully.");

    // Connect consumer
    await consumer.connect();
    logger.info("✅ Kafka consumer connected successfully.");
  } catch (error) {
    logger.error("❌ Failed to connect to Kafka.", { error });
    // Re-throw to signal a critical startup failure
    throw error;
  }
};

/**
 * Disconnects Kafka producer and consumer connections.
 * @returns {Promise<void>}
 */
export const disconnectKafka = async (): Promise<void> => {
  try {
    // The library handles calling disconnect multiple times, but explicitly
    // calling it ensures a clean shutdown.
    await producer.disconnect();
    logger.info("🛑 Kafka producer disconnected.");

    await consumer.disconnect();
    logger.info("🛑 Kafka consumer disconnected.");
  } catch (error) {
    // FIX: Removed the extraneous '},{find:' syntax error here
    logger.error("⚠️ Failed to disconnect from Kafka.", { error });
    // In a shutdown sequence, sometimes we just log and ignore the re-throw
    // depending on the application's overall error strategy.
  }
};

/**
 * Sends a message to a specified Kafka topic.
 * @param {string} topic - The Kafka topic to send the message to.
 * @param {Record<string, any>} message - The message object to send. Must be stringifiable.
 * @returns {Promise<void>}
 */
export const sendMessage = async (
  topic: string,
  message: Record<string, any>,
): Promise<void> => {
  try {
    // Generate a key from the message ID or a timestamp for partition assignment
    const key = message.id?.toString() || String(Date.now());

    await producer.send({
      topic,
      messages: [
        {
          key: key,
          value: JSON.stringify(message),
        },
      ],
    });
    logger.info(`📤 Message sent successfully to topic: ${topic}`, {
      key,
      topic,
    });
  } catch (error) {
    logger.error(`❌ Failed to send message to topic ${topic}.`, {
      error,
      message,
    });
    throw error;
  }
};

/**
 * Subscribes the consumer to a Kafka topic and starts message processing.
 * @param {string} topic - The topic to subscribe to.
 * @param {(message: any) => Promise<void>} callback - The async function to process each received message.
 * @returns {Promise<void>}
 */
export const subscribeToTopic = async (
  topic: string,
  callback: (message: any) => Promise<void>,
): Promise<void> => {
  try {
    // Set fromBeginning: false to consume new messages only, or true for all
    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
      // Auto-commit is enabled by default. Set autoCommit: false
      // and use consumer.commitOffsets() for manual control if needed.
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        const offset = message.offset;

        if (value) {
          try {
            // Attempt to parse the message value
            const parsedValue = JSON.parse(value);
            // Execute the provided callback function
            await callback(parsedValue);

            logger.info(
              `📥 Message processed successfully from topic: ${topic}`,
              {
                topic,
                partition,
                offset,
              },
            );
          } catch (error) {
            // Log parsing or callback execution error
            logger.error(
              `❌ Failed to process or parse message from topic ${topic}.`,
              {
                error,
                topic,
                partition,
                offset,
              },
            );
            // Note: If the callback fails, the offset will still be committed unless
            // autoCommit is disabled. Consider manual commits for critical workflows.
          }
        }
      },
    });

    logger.info(`👂 Subscribed to topic: ${topic}. Starting to listen...`);
  } catch (error) {
    logger.error(`❌ Failed to subscribe or run consumer for topic ${topic}.`, {
      error,
    });
    throw error;
  }
};

// Simplified and explicit default export
export { kafka, producer, consumer };

export default {
  initializeKafka,
  disconnectKafka,
  sendMessage,
  subscribeToTopic,
};
