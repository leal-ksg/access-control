import rateLimit from "express-rate-limit";
import { HttpError } from "../core/http-error";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,

  handler: (req, res, next, options) => {
    next(
      new HttpError(
        "Muitas requisições. Tente novamente mais tarde.",
        options.statusCode,
      ),
    );
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (req, res, next, options) => {
    next(
      new HttpError(
        "Muitas tentativas de login. Tente novamente em 15 minutos.",
        options.statusCode,
      ),
    );
  },
});
