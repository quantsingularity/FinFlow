import { Router } from "express";
export class TenantController {
  // Service is injected for future use by the route handlers.
  constructor(_service?: any) {}

  getRouter(): Router {
    return Router();
  }
}
