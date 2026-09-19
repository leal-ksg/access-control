import { Router } from "express";
import { userRouter } from "./user";
import { lockerRouter } from "./locker";

export const router = Router()

router.use("/users", userRouter)
router.use("/lockers", lockerRouter)