import * as LockerController from "../controllers/locker-controller";
import { Router } from "express";
import { validationMiddleware } from "../middlewares/validation-middleware";
import { createLockerSchema, updateLockerSchema } from "../schemas/locker";
import { UserRole } from "../generated/prisma/enums";
import { requireLockerAccess, requireRole } from "../middlewares/role-middleware";

export const lockerRouter = Router();

lockerRouter
  .get("/", requireRole(UserRole.ADMIN), LockerController.getLockers)
  .get(
    "/:id",
    requireLockerAccess("id", UserRole.ADMIN, UserRole.TEACHER),
    LockerController.getLockerById,
  )
  .post(
    "/",
    requireRole(UserRole.ADMIN),
    validationMiddleware(createLockerSchema),
    LockerController.createLocker,
  )
  .post("/:id/unlock", LockerController.unlockLocker)
  .patch(
    "/:id",
    requireRole(UserRole.ADMIN),
    validationMiddleware(updateLockerSchema),
    LockerController.updateLocker,
  )
  .delete("/:id", requireRole(UserRole.ADMIN), LockerController.deleteLocker);
