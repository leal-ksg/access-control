import { HttpError } from "../core/http-error";
import * as lockerService from "../services/locker-service";
import { Request, Response } from "express";

export async function getLockers(req: Request, res: Response) {
  const lockers = await lockerService.getLockers();

  return res.json(lockers);
}

export async function getLockerById(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!id) throw new HttpError("Informe o ID para buscar um armário", 400);

  const locker = await lockerService.getLockerById(id);

  return res.json(locker);
}

export async function createLocker(req: Request, res: Response) {
  const newLocker = await lockerService.createLocker(req.body);

  return res.status(201).json(newLocker);
}

export async function updateLocker(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!id) throw new HttpError("Informe o ID para atualizar um armário", 400);

  const user = await lockerService.updateLocker(id, req.body);

  return res.json(user);
}

export async function deleteLocker(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!id) throw new HttpError("Informe o ID para deletar um armário", 400);

  await lockerService.deleteLocker(id);

  return res.status(204).send();
}

export async function unlockLocker(req: Request, res: Response) {
  const lockerId = req.params.id as string;
  // const userId = req.user?.id as string;
  const userId = 'cmu7kgu500000dwmdmrwl65ti'

  if (!lockerId || !userId)
    throw new HttpError(
      "Informe o ID do armário e o ID do usuário para realizar a liberação",
      400,
    );

  await lockerService.unlockLocker(lockerId, userId);

  return res.status(204).send();
}
