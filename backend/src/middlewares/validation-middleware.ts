import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export function validationMiddleware<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.issues[0]?.message,
      });
    }

    next();
  };
}
