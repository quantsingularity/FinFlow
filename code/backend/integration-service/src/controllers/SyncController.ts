import { Router } from "express";
export class SyncController {
  // Dependency injected by index.ts for use by route handlers.
  constructor(_dep?: any) {}

  getRouter(): Router {
    return Router();
  }
}
