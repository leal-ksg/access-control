import { UserRole } from "../generated/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: LoginResponse;
    }
  }
}

export {};
