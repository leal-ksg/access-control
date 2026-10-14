import { Prisma, UserRole } from "../generated/prisma/client";

export type CreateUserDTO = Prisma.UserCreateInput;

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}
