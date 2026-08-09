import express from "express";
import transactionController from "./transaction.controller";
import { validate } from "./middleware/validation.middleware";
import {
  createTransactionValidation,
  transactionIdValidation,
  updateTransactionValidation,
} from "./transaction.validator";

const router = express.Router();

router.post(
  "/",
  validate(createTransactionValidation),
  transactionController.createTransaction.bind(transactionController),
);
router.get(
  "/date-range",
  transactionController.getTransactionsByDateRange.bind(transactionController),
);
router.get(
  "/:id",
  validate(transactionIdValidation),
  transactionController.getTransactionById.bind(transactionController),
);
router.get(
  "/",
  transactionController.getTransactionsByUserId.bind(transactionController),
);
router.put(
  "/:id",
  validate(updateTransactionValidation),
  transactionController.updateTransaction.bind(transactionController),
);
router.delete(
  "/:id",
  validate(transactionIdValidation),
  transactionController.deleteTransaction.bind(transactionController),
);

export default router;
