import "dotenv/config";
import express from "express";
import session from "express-session";
import { prisma } from "./lib/prisma.js";
import bcrypt from "bcrypt";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-da-ong-anjos-de-patas-session-2026-rs",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 dia
    },
  })
);

app.get("/", (req, res) => {
  res.send("Funcionando!");
});

app.get("/animais", async (req, res) => {
  const animais = await prisma.animal.findMany();
  res.json(animais);
});

app.post("/animais", async (req, res) => {
  const { nome, especie, idade, descricao, fotoUrl, } = req.body;
  const novoAnimal = await prisma.animal.create({
    data: {
      nome,
      especie,
      idade,
      descricao,
      fotoUrl,
    }
  });
  res.status(201).json(novoAnimal);
});

app.patch("/animais/:id", async (req, res) => {
  const { id } = req.params;
  const { adotado } = req.body;
  const animalAtualizado = await prisma.animal.update({
    where: { id },
    data: { adotado },
  });
  res.json(animalAtualizado);
});

app.delete("/animais/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.animal.delete({
    where: { id },
  });
  res.status(204).send();
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return res.status(401).json({ erro: "Email ou senha inválidos" });
  }

  const senhaCorreta = await bcrypt.compare(password, admin.password);

  if (!senhaCorreta) {
    return res.status(401).json({ erro: "Email ou senha inválidos" });
  }

  req.session.adminId = admin.id;

  res.json({ mensagem: "Login realizado com sucesso" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});