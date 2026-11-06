import * as deviceController from "../controllers/device-controller"
import { Request, Response, Router } from "express";
import { UserRole } from "../generated/prisma/enums";
import { requireRole } from "../middlewares/role-middleware";

export const deviceRouter = Router()

deviceRouter.get(
  "/unlinked",
  requireRole(UserRole.ADMIN),
  deviceController.getUnlinkedDevices,
)