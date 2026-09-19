import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const isDev = process.env.NODE_ENV === "development";

export const prisma = new PrismaClient({
  adapter,
  transactionOptions: {
    maxWait: isDev ? 10000 : 2000, // 10s em dev, 2s em prod
    timeout: isDev ? 60000 : 5000, // 60s em dev, 5s em prod
  },
});

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("-> Postgres conectado com sucesso!");
  } catch (error) {
    console.error("Erro na conexão do banco de dados:", error);
  }
}
