import express from "express";
import forecastController from "./forecast.controller";

const router = express.Router();

// Create/generate a forecast for the authenticated user.
// The create operation is served by the controller's generateForecast handler.
router.post("/", forecastController.generateForecast.bind(forecastController));

// List forecasts for the authenticated user.
router.get(
  "/",
  forecastController.getForecastsByUserId.bind(forecastController),
);

// NOTE: The following endpoints are intentionally not wired.
// The handlers getForecastById, updateForecast and deleteForecast are
// referenced by the original route table but are not implemented in
// ForecastController or ForecastService. They are missing features, not
// bugs, and are left unrouted until the corresponding controller and
// service methods exist. See FIXES.md.
// router.get("/:id", forecastController.getForecastById.bind(forecastController));
// router.put("/:id", forecastController.updateForecast.bind(forecastController));
// router.delete("/:id", forecastController.deleteForecast.bind(forecastController));

export default router;
