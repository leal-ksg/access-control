import { UserRole } from "../generated/prisma/enums";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    surname: string;
    active: boolean;
    createdAt: Date;
    role: UserRole;
  };
  token: string;
}
