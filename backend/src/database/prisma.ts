import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({
  adapter,
});

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("-> Postgres conectado com sucesso!");
  } catch (error) {
    console.error("Erro na conexão do banco de dados:", error);
  }
}
