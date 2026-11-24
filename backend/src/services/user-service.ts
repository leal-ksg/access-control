import { HttpError } from "../core/http-error";
import { prisma } from "../database/prisma";
import { User } from "../generated/prisma/client";
import { CreateUserDTO } from "../types/user";
import { AuthenticatedUser } from "../types/login";
import { isRootUser, visibleUsersWhere } from "../core/root-user";
import { UserRole } from "../generated/prisma/enums";
import bcrypt from "bcrypt";

// Nunca devolver o hash da senha nas respostas da API
type PublicUser = Omit<User, "password">;

export async function getUserById(
  id: string,
  requester?: AuthenticatedUser,
): Promise<PublicUser | null> {
  const user = await prisma.user.findFirst({
    where: {
      id,
      ...visibleUsersWhere(requester),
    },
    omit: { password: true },
  });

  return user;
}

export async function getUsers(
  requester?: AuthenticatedUser,
): Promise<PublicUser[]> {
  const user = await prisma.user.findMany({
    where: visibleUsersWhere(requester),
    omit: { password: true },
  });

  return user;
}

// Garante que o alvo existe e é visível para quem está pedindo; um root
// alvejado por outro perfil responde como "não encontrado".
async function assertUserVisible(id: string, requester?: AuthenticatedUser) {
  const user = await getUserById(id, requester);

  if (!user) throw new HttpError("Usuário não encontrado", 404);
}

export async function createUser(data: CreateUserDTO): Promise<User> {
  // isRoot nunca vem de formulário: só o script create-root define
  const { isRoot: _ignored, ...safeData } = data;

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email: safeData.email,
    },
  });

  if (userAlreadyExists) {
    throw new HttpError("Já existe um usuário com esse e-mail", 409);
  }

  const hash = await bcrypt.hash(safeData.password, 10);
  const newUser = await prisma.user.create({
    data: {
      ...safeData,
      password: hash,
    },
  });

  return newUser;
}

// Exclusão definitiva. As permissões de armário do usuário são apagadas
// junto; os eventos dele continuam no histórico, sem o vínculo de autor
// (a FK Event.userId é ON DELETE SET NULL).
export async function deleteUser(
  id: string,
  requester?: AuthenticatedUser,
): Promise<void> {
  if (requester?.id === id)
    throw new HttpError("Você não pode excluir a própria conta", 400);

  const user = await getUserById(id, requester);

  if (!user) throw new HttpError("Usuário não encontrado", 404);

  // Nenhum root é excluído pela API, nem por outro root
  if (user.isRoot)
    throw new HttpError("Este usuário não pode ser excluído", 403);

  // Admin exclui professores e estudantes; administradores, só o root
  if (user.role === UserRole.ADMIN && !isRootUser(requester))
    throw new HttpError(
      "Apenas o usuário root pode excluir administradores",
      403,
    );

  await prisma.$transaction([
    prisma.lockerPermission.deleteMany({ where: { userId: id } }),
    prisma.user.delete({ where: { id } }),
  ]);
}

export async function updateUser(
  id: string,
  data: Omit<Partial<User>, "id">,
  requester?: AuthenticatedUser,
): Promise<void> {
  await assertUserVisible(id, requester);

  // isRoot nunca vem de formulário: só o script create-root define
  const { isRoot: _ignored, ...safeData } = data;
  let updateUser: Omit<Partial<User>, "id" | "isRoot"> = safeData;

  if (safeData.password !== undefined) {
    const { password, ...rest } = safeData;
    const hash = await bcrypt.hash(password, 10);
    updateUser = { password: hash, ...rest };
  }

  await prisma.user.update({
    data: updateUser,
    where: {
      id,
    },
  });
}
