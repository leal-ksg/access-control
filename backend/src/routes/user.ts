import * as UserController from "../controllers/user-controller";
import { Router } from "express";
import { validationMiddleware } from "../middlewares/validation-middleware";
import { createUserSchema, updateUserSchema } from "../schemas/user";

export const userRouter = Router();

userRouter.get("/", UserController.getUsers);
userRouter.get("/:id", UserController.getUserById);
userRouter.post(
  "/:id",
  validationMiddleware(createUserSchema),
  UserController.createUser,
);
userRouter.patch(
  "/:id",
  validationMiddleware(updateUserSchema),
  UserController.updateUser,
);
userRouter.delete("/:id", UserController.deleteUser);
