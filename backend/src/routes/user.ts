import * as UserController from "../controllers/user-controller";
import { Router } from "express";
import { validationMiddleware } from "../middlewares/validation-middleware";
import { createUserSchema, updateUserSchema } from "../schemas/user";

export const userRouter = Router();

userRouter
  .get("/", UserController.getUsers)
  .get("/:id", UserController.getUserById)
  .post("/", validationMiddleware(createUserSchema), UserController.createUser)
  .patch(
    "/:id",
    validationMiddleware(updateUserSchema),
    UserController.updateUser,
  )
  .delete("/:id", UserController.deleteUser);
