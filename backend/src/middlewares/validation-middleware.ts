import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export function validationMiddleware<T>(
  schema: ZodType<T>,
  source: "body" | "query" | "params" = "body",
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.issues[0]?.message,
      });
    }

    next();
  };
}
