import * as authController from "../controllers/auth-controller";
import { Router } from "express";
import { validationMiddleware } from "../middlewares/validation-middleware";
import { loginSchema } from "../schemas/auth";
import { loginLimiter } from "../middlewares/rate-limiter";

export const authRouter = Router();

authRouter.post(
  "/login",
  loginLimiter,
  validationMiddleware(loginSchema),
  authController.login,
);
