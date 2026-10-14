import { UserRole } from "../generated/prisma/enums";

export interface LoginResponse {
  user: AuthenticatedUser;
  token: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  surname: string;
  active: boolean;
  createdAt: Date;
  role: UserRole;
}
