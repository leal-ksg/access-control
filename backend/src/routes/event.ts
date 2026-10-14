import * as eventController from "../controllers/event-controller";
import { Router } from "express";
import { validationMiddleware } from "../middlewares/validation-middleware";
import { getEventsQuerySchema } from "../schemas/event";

export const eventRouter = Router();

eventRouter
  .get(
    "/",
    validationMiddleware(getEventsQuerySchema, "query"),
    eventController.getEvents,
  )
  .get("/:id", eventController.getEventById);
