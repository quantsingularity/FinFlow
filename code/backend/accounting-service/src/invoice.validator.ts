import { body, param } from "express-validator";
import { InvoiceStatus } from "./invoice.types";

// Import the enum's own values instead of duplicating them as a literal list,
// which had drifted out of sync: it previously allowed only
// ["PENDING", "PAID", "OVERDUE", "CANCELLED"], silently rejecting the
// "DRAFT" and "SENT" statuses that InvoiceStatus (and the Invoice Prisma
// model) actually support.
const VALID_INVOICE_STATUSES = Object.values(InvoiceStatus);

// Validation rules for invoice creation
export const createInvoiceValidation = [
  body("client").isString().notEmpty().withMessage("Client name is required"),
  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),
  body("dueDate")
    .isISO8601()
    .withMessage("Due date must be a valid date in ISO 8601 format"),
  body("status")
    .optional()
    .isIn(VALID_INVOICE_STATUSES)
    .withMessage(`Status must be one of: ${VALID_INVOICE_STATUSES.join(", ")}`),
];

// Validation rules for invoice ID parameter
export const invoiceIdValidation = [
  param("id").isUUID().withMessage("Invoice ID must be a valid UUID"),
];

// Validation rules for invoice update
export const updateInvoiceValidation = [
  param("id").isUUID().withMessage("Invoice ID must be a valid UUID"),
  body("client")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Client name cannot be empty"),
  body("amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date in ISO 8601 format"),
  body("status")
    .optional()
    .isIn(VALID_INVOICE_STATUSES)
    .withMessage(`Status must be one of: ${VALID_INVOICE_STATUSES.join(", ")}`),
];

export default {
  createInvoiceValidation,
  invoiceIdValidation,
  updateInvoiceValidation,
};
