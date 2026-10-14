import { Router } from "express";
import { userRouter } from "./user";
import { lockerRouter } from "./locker";
import { deviceRouter } from "./device";
import { lockerPermissionRouter } from "./locker-permission";
import { authRouter } from "./auth";
import { eventRouter } from "./event";
import { authMiddleware } from "../middlewares/auth-middleware";

export const router = Router();

// public routes
router.use("/auth", authRouter);

router.use(authMiddleware);

// private routes
router.use("/users", userRouter);
router.use("/lockers", lockerRouter);
router.use("/devices", deviceRouter);
router.use("/permissions", lockerPermissionRouter);
router.use("/events", eventRouter);
