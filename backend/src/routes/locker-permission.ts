import * as lockerPermissionController from "../controllers/locker-permission-controller";
import { Router } from "express";
import { UserRole } from "../generated/prisma/enums";
import { requireRole, requireSelfOrRole } from "../middlewares/role-middleware";

export const lockerPermissionRouter = Router();

lockerPermissionRouter
  .get(
    "/user/:id",
    requireSelfOrRole("id", UserRole.ADMIN, UserRole.TEACHER),
    lockerPermissionController.getPermissionsByUserId,
  )
  .get(
    "/locker/:id",
    requireRole(UserRole.ADMIN, UserRole.TEACHER),
    lockerPermissionController.getPermissionsByLockerId,
  )
  .patch(
    "/:lockerId",
    requireRole(UserRole.ADMIN, UserRole.TEACHER),
    lockerPermissionController.upsertPermissions,
  )
  .delete(
    "/:lockerId",
    requireRole(UserRole.ADMIN),
    lockerPermissionController.revokePermissions,
  );
