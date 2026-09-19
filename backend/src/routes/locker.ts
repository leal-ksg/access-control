import * as LockerController from "../controllers/locker-controller";
import { Router } from "express";
import { validationMiddleware } from "../middlewares/validation-middleware";
import { createLockerSchema, updateLockerSchema } from "../schemas/locker";

export const lockerRouter = Router();

lockerRouter
  .get("/", LockerController.getLockers)
  .get("/:id", LockerController.getLockerById)
  .post(
    "/",
    validationMiddleware(createLockerSchema),
    LockerController.createLocker,
  )
  .post("/:id/unlock", LockerController.unlockLocker)
  .patch(
    "/:id",
    validationMiddleware(updateLockerSchema),
    LockerController.updateLocker,
  )
  .delete("/:id", LockerController.deleteLocker);
