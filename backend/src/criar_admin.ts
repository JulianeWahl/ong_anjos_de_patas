import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "./lib/prisma.js";

// Uso: npm run criar-admin -- email@da-ong.org "uma senha forte"
// A senha NÃO fica no código, então não vai parar no GitHub.
async function criarAdmin() {
  const [emailDigitado, senhaPura] = process.argv.slice(2);

  if (!emailDigitado || !senhaPura) {
    throw new Error('Uso: npm run criar-admin -- email@da-ong.org "senha forte"');
  }
  if (senhaPura.length < 10) {
    throw new Error("Use uma senha com pelo menos 10 caracteres");
  }

  const email = emailDigitado.trim().toLowerCase();
  const senhaCriptografada = await bcrypt.hash(senhaPura, 12);

  // upsert: cria o admin ou, se o e-mail já existir, troca a senha.
  const admin = await prisma.admin.upsert({
    where: { email },
    create: { email, password: senhaCriptografada },
    update: { password: senhaCriptografada },
  });

  console.log("Admin pronto:", admin.email);
}

criarAdmin()
  .catch((erro) => {
    console.error("Erro ao criar admin:", erro.message ?? erro);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
