import { Router } from "express";
import { userRouter } from "./user";
import { lockerRouter } from "./locker";
import { deviceRouter } from "./device";

export const router = Router();

router.use("/users", userRouter);
router.use("/lockers", lockerRouter);
router.use("/devices", deviceRouter);
