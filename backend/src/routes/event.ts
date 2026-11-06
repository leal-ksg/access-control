import * as eventController from "../controllers/event-controller";
import { Router } from "express";
import { validationMiddleware } from "../middlewares/validation-middleware";
import { getEventsQuerySchema } from "../schemas/event";
import { UserRole } from "../generated/prisma/enums";
import { requireRole } from "../middlewares/role-middleware";

export const eventRouter = Router();

eventRouter
  .use(requireRole(UserRole.ADMIN))
  .get(
    "/",
    validationMiddleware(getEventsQuerySchema, "query"),
    eventController.getEvents,
  )
  .get("/:id", eventController.getEventById);
