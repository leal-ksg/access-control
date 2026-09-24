import * as lockerPermissionController from "../controllers/locker-permission-controller";
import { Router } from "express";

export const lockerPermissionRouter = Router();

lockerPermissionRouter
  .get("/user/:id", lockerPermissionController.getPermissionsByUserId)
  .get("/locker/:id", lockerPermissionController.getPermissionsByLockerId)
  .patch("/:lockerId", lockerPermissionController.upsertPermissions)
  .delete("/:lockerId", lockerPermissionController.revokePermissions);
