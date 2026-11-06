import * as UserController from "../controllers/user-controller";
import { Router } from "express";
import { validationMiddleware } from "../middlewares/validation-middleware";
import { createUserSchema, updateUserSchema } from "../schemas/user";
import { UserRole } from "../generated/prisma/enums";
import { requireRole, requireSelfOrRole } from "../middlewares/role-middleware";

export const userRouter = Router();

userRouter
  .get("/", requireRole(UserRole.ADMIN, UserRole.TEACHER), UserController.getUsers)
  .get(
    "/:id",
    requireSelfOrRole("id", UserRole.ADMIN, UserRole.TEACHER),
    UserController.getUserById,
  )
  .post(
    "/",
    requireRole(UserRole.ADMIN),
    validationMiddleware(createUserSchema),
    UserController.createUser,
  )
  .patch(
    "/:id",
    requireSelfOrRole("id", UserRole.ADMIN),
    validationMiddleware(updateUserSchema),
    UserController.updateUser,
  )
  .delete("/:id", requireRole(UserRole.ADMIN), UserController.deleteUser);
