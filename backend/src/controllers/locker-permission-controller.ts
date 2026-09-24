import * as lockerPermissionService from "../services/locker-permission-service";
import { Request, Response } from "express";
import { HttpError } from "../core/http-error";

export async function getPermissionsByLockerId(req: Request, res: Response) {
  const lockerId = req.params.id as string;

  if (!lockerId)
    throw new HttpError("Informe um ID de armário para buscar permissões");

  const permissions =
    await lockerPermissionService.getPermissionsByLockerId(lockerId);

  return res.json(permissions);
}

export async function getPermissionsByUserId(req: Request, res: Response) {
  const userId = req.params.id as string;

  if (!userId)
    throw new HttpError("Informe um ID de usuário para buscar permissões");

  const permissions =
    await lockerPermissionService.getPermissionsByUserId(userId);

  return res.json(permissions);
}

export async function upsertPermissions(req: Request, res: Response) {
  const lockerId = req.params.lockerId as string;

  if (!lockerId)
    throw new HttpError("Informe um ID de armário para conceder permissões");

  await lockerPermissionService.upsertPermissions(
    lockerId,
    req.user?.id!,
    req.body,
  );

  return res.send({});
}

export async function revokePermissions(req: Request, res: Response) {
  const lockerId = req.params.lockerId as string;

  if (!lockerId)
    throw new HttpError("Informe um ID de armário para revogar permissões");

  await lockerPermissionService.revokePermissions(
    lockerId,
    req.user?.id!,
    req.body,
  );

  return res.send({});
}
