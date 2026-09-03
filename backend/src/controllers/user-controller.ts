import * as userService from "../services/user-service";
import { Request, Response } from "express";

export async function createUser(req: Request, res: Response) {
  const newUser = await userService.createUser(req.body);

  return res.status(201).json(newUser);
}
