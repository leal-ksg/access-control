// Cria (ou promove) o usuário root: um ADMIN oculto que os demais perfis
// não enxergam, não editam e não apagam.
//
// Uso: npm run create-root
// Conecta no banco do DATABASE_URL do .env — confira antes de rodar.
import "dotenv/config";
import bcrypt from "bcrypt";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { prisma } from "../database/prisma";
import { UserRole } from "../generated/prisma/enums";

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });
  const host = new URL(process.env.DATABASE_URL ?? "").host;

  console.log(`Banco: ${host}`);

  const email = (await rl.question("E-mail: ")).trim();
  if (!email) throw new Error("Informe um e-mail");

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    const answer = await rl.question(
      `Já existe ${existing.name} ${existing.surname} (${existing.role}). Tornar root? [s/N] `,
    );
    rl.close();

    if (answer.trim().toLowerCase() !== "s") return console.log("Cancelado.");

    await prisma.user.update({
      where: { id: existing.id },
      data: { isRoot: true, role: UserRole.ADMIN, active: true },
    });

    return console.log("Usuário promovido a root.");
  }

  const name = (await rl.question("Nome: ")).trim();
  const surname = (await rl.question("Sobrenome: ")).trim();
  const password = await rl.question("Senha: ");
  rl.close();

  if (!name || !surname || !password)
    throw new Error("Nome, sobrenome e senha são obrigatórios");

  await prisma.user.create({
    data: {
      email,
      name,
      surname,
      password: await bcrypt.hash(password, 10),
      role: UserRole.ADMIN,
      isRoot: true,
    },
  });

  console.log("Usuário root criado.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
