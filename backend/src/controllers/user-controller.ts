import { HttpError } from "../core/http-error";
import * as userService from "../services/user-service";
import { Request, Response } from "express";

export async function getUsers(req: Request, res: Response) {
  const users = await userService.getUsers();

  return res.json(users);
}

export async function getUserById(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!id) throw new HttpError("Informe o ID para buscar um usuário", 400);

  const user = await userService.getUserById(id);

  return res.json(user);
}

export async function createUser(req: Request, res: Response) {
  const user = await userService.createUser(req.body);

  const { password, ...userWithoutPassword } = user;
  return res.status(201).json(userWithoutPassword);
}

export async function updateUser(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!id) throw new HttpError("Informe o ID para atualizar um usuário", 400);

  const user = await userService.updateUser(id, req.body);

  return res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!id) throw new HttpError("Informe o ID para deletar um usuário", 400);

  await userService.deleteUser(id);

  return res.status(204).send();
}
