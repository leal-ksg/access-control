import { NextFunction, Request, Response } from "express";
import { HttpError } from "../core/http-error";
import { prisma } from "../database/prisma";
import { UserRole } from "../generated/prisma/enums";

const FORBIDDEN_MESSAGE = "Você não tem permissão para acessar este recurso";

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new HttpError(FORBIDDEN_MESSAGE, 403);
    }

    next();
  };
}

export function requireSelfOrRole(param: string, ...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const isSelf = req.user?.id === req.params[param];
    const hasRole = !!req.user && roles.includes(req.user.role);

    if (!isSelf && !hasRole) {
      throw new HttpError(FORBIDDEN_MESSAGE, 403);
    }

    next();
  };
}

export function requireLockerAccess(param: string, ...bypassRoles: UserRole[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new HttpError(FORBIDDEN_MESSAGE, 403);

    if (bypassRoles.includes(req.user.role)) return next();

    const lockerId = req.params[param] as string;

    const permission = await prisma.lockerPermission.findUnique({
      where: {
        lockerId_userId: {
          lockerId,
          userId: req.user.id,
        },
      },
    });

    const expired =
      !!permission?.expiresAt && permission.expiresAt <= new Date();

    if (!permission || expired) {
      throw new HttpError(FORBIDDEN_MESSAGE, 403);
    }

    next();
  };
}
