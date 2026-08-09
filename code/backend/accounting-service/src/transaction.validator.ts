import { body, param } from "express-validator";

// Validation rules for transaction creation
export const createTransactionValidation = [
  // Unlike invoices (always a positive amount owed), transactions represent
  // both inflows and outflows via a signed amount - see e.g. Analytics.tsx's
  // `(t.amount || 0) >= 0 ? inflow : outflow` logic. This previously required
  // `min: 0.01` (copied from invoice.validator.ts's positive-only check),
  // which would have rejected every expense/outflow transaction (any
  // negative amount) at the validation layer.
  body("amount")
    .isFloat()
    .withMessage("Amount must be a number")
    .not()
    .equals("0")
    .withMessage("Amount cannot be zero"),
  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid date in ISO 8601 format"),
];

// Validation rules for transaction ID parameter
export const transactionIdValidation = [
  param("id").isUUID().withMessage("Transaction ID must be a valid UUID"),
];

// Validation rules for transaction update
export const updateTransactionValidation = [
  param("id").isUUID().withMessage("Transaction ID must be a valid UUID"),
  body("amount")
    .optional()
    .isFloat()
    .withMessage("Amount must be a number")
    .not()
    .equals("0")
    .withMessage("Amount cannot be zero"),
  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid date in ISO 8601 format"),
];

export default {
  createTransactionValidation,
  transactionIdValidation,
  updateTransactionValidation,
};
