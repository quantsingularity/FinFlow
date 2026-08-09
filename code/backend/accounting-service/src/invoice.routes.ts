import express from "express";
import invoiceController from "./invoice.controller";
import { validate } from "./middleware/validation.middleware";
import {
  createInvoiceValidation,
  invoiceIdValidation,
  updateInvoiceValidation,
} from "./invoice.validator";

const router = express.Router();

router.post(
  "/",
  validate(createInvoiceValidation),
  invoiceController.createInvoice.bind(invoiceController),
);
router.get(
  "/:id",
  validate(invoiceIdValidation),
  invoiceController.getInvoiceById.bind(invoiceController),
);
router.get("/", invoiceController.getInvoicesByUserId.bind(invoiceController));
router.put(
  "/:id",
  validate(updateInvoiceValidation),
  invoiceController.updateInvoice.bind(invoiceController),
);
router.delete(
  "/:id",
  validate(invoiceIdValidation),
  invoiceController.deleteInvoice.bind(invoiceController),
);

export default router;
