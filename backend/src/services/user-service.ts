import { HttpError } from "../core/http-error";
import { prisma } from "../database/prisma";
import { User } from "../generated/prisma/client";
import { CreateUserDTO } from "../types/user";

export async function createUser(data: CreateUserDTO): Promise<User> {

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
        email: data.email
    }
  })

  if (userAlreadyExists) {
    throw new HttpError("Já existe um usuário com esse e-mail", 409)
  }

  const newUser = await prisma.user.create({ data });

  return newUser
}
