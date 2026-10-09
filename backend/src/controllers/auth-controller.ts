import { Request, Response } from "express";
import * as authService from "../services/auth-service";

export async function login(req: Request, res: Response) {
  const loginResponse = await authService.login(
    req.body.email,
    req.body.password,
  );

  return res.json(loginResponse);
}
