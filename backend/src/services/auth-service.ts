import { HttpError } from "../core/http-error";
import { prisma } from "../database/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginResponse } from "../types/login";

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new HttpError("Usuário ou senha incorretos");

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw new HttpError("Usuário ou senha incorretos");

  if (!user.active) throw new HttpError("Usuário inativo");

  const { password: _, ...userWithoutPassword } = user;

  const token = jwt.sign(
    { sub: userWithoutPassword },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" },
  );

  return { user: userWithoutPassword, token };
}
