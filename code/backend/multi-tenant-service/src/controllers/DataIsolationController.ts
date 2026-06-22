import { Router } from "express";
export class DataIsolationController {
  // Service is injected for future use by the route handlers.
  constructor(_service?: any) {}

  getRouter(): Router {
    return Router();
  }
}
