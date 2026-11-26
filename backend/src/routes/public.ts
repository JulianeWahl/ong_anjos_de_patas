import { Router } from "express";
import { prisma } from "../lib/prisma.js";

// Rotas do site público: ninguém precisa estar logado.
export const publicRouter = Router();

publicRouter.get("/", async (req, res) => {
  const destaques = await prisma.animal.findMany({
    where: { adotado: false },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  res.render("publico/inicio", { titulo: "Anjos de Patas", destaques });
});

publicRouter.get("/sobre", (req, res) => {
  res.render("publico/sobre", { titulo: "Sobre nós" });
});

publicRouter.get("/animais", async (req, res) => {
  const animais = await prisma.animal.findMany({
    where: { adotado: false },
    orderBy: { createdAt: "desc" },
  });
  res.render("publico/animais", { titulo: "Animais para adoção", animais });
});

publicRouter.get("/animais/:id", async (req, res, next) => {
  const animal = await prisma.animal.findUnique({ where: { id: req.params.id } });
  if (!animal) return next(); // cai na página 404
  res.render("publico/animal", { titulo: animal.nome, animal });
});

publicRouter.get("/como-ajudar", (req, res) => {
  const pix = {
    chave: process.env.PIX_CHAVE ?? "",
    nome: process.env.PIX_NOME ?? "",
  };
  res.render("publico/como-ajudar", { titulo: "Como ajudar", pix });
});

publicRouter.get("/contato", (req, res) => {
  res.render("publico/contato", { titulo: "Contato" });
});
