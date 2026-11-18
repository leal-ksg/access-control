import { Request, Response, Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ ok: true });
});