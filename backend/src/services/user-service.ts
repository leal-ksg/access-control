import { HttpError } from "../core/http-error";
import { prisma } from "../database/prisma";
import { User } from "../generated/prisma/client";
import { CreateUserDTO } from "../types/user";
import bcrypt from "bcrypt";

export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return user;
}

export async function getUsers(): Promise<User[]> {
  const user = await prisma.user.findMany();

  return user;
}

export async function createUser(data: CreateUserDTO): Promise<User> {
  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (userAlreadyExists) {
    throw new HttpError("Já existe um usuário com esse e-mail", 409);
  }

  const hash = await bcrypt.hash(data.password, 10);
  const newUser = await prisma.user.create({
    data: {
      ...data,
      password: hash,
    },
  });

  return newUser;
}

export async function deleteUser(id: string): Promise<void> {
  await prisma.user.update({
    data: { active: false },
    where: {
      id,
    },
  });
}

export async function updateUser(
  id: string,
  data: Omit<Partial<User>, "id">,
): Promise<void> {
  let updateUser = data;

  if ("password" in data) {
    const { password, ...rest } = data;
    const hash = await bcrypt.hash(password, 10);
    updateUser = { password: hash, ...rest };
  }

  await prisma.user.update({
    data,
    where: {
      id,
    },
  });
}
