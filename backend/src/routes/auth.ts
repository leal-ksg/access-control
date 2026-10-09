import * as authController from "../controllers/auth-controller";
import { Router } from "express";
import { validationMiddleware } from "../middlewares/validation-middleware";
import { loginSchema } from "../schemas/auth";

export const authRouter = Router();

authRouter.post(
  "/login",
  validationMiddleware(loginSchema),
  authController.login,
);
