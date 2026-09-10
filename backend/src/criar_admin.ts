import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "./lib/prisma.js";

async function criarAdmin() {
  const email = "email@exemplo.com"; // colocar o email da ONG
  const senhaPura = "senha123"; // trocar pela senha da ONG

  const senhaCriptografada = await bcrypt.hash(senhaPura, 10);

  const admin = await prisma.admin.create({
    data: {
      email,
      password: senhaCriptografada,
    },
  });

  console.log("Admin criado com sucesso:", admin.email);
}

criarAdmin()
  .catch((erro) => console.error("Erro ao criar admin:", erro))
  .finally(() => process.exit());