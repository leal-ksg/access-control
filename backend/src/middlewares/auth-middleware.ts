import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../generated/prisma/enums";
import { AuthenticatedUser, LoginResponse } from "../types/login";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthenticatedUser;
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const secret = process.env.JWT_SECRET;

  if (!secret)
    return res.status(500).send({ error: "Falha durante a autenticação" });

  const authHeader = req.headers.authorization;
  let token = "";

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1] || "";
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).send({ error: "Usuário não autorizado" });
  }

  try {
    const payload = jwt.verify(token, secret);

    req.user = payload.sub as unknown as AuthenticatedUser;
    next();
  } catch {
    return res
      .status(401)
      .send({ error: "Usuário não autorizado ou token expirado" });
  }
}
