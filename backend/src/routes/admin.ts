import { Router } from "express";
import type { Request } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { exigirLogin } from "../middleware/auth.js";

// Tudo aqui fica sob /admin (ver server.ts).
export const adminRouter = Router();

// Pega a mensagem guardada na sessão (ex.: "Animal removido") e apaga,
// para ela aparecer uma vez só no painel.
function pegarMensagem(req: Request): string | null {
  const mensagem = req.session.mensagem ?? null;
  delete req.session.mensagem;
  return mensagem;
}

// ================= Rotas SEM login =================

adminRouter.get("/login", (req, res) => {
  if (req.session.adminId) return res.redirect("/admin");
  res.render("admin/login", { titulo: "Entrar", erro: null });
});

adminRouter.post("/login", async (req, res, next) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");

  const admin = email ? await prisma.admin.findUnique({ where: { email } }) : null;
  const senhaCorreta = admin ? await bcrypt.compare(password, admin.password) : false;

  if (!admin || !senhaCorreta) {
    // Mesma mensagem nos dois casos: não revela se o e-mail existe.
    return res.status(401).render("admin/login", {
      titulo: "Entrar",
      erro: "E-mail ou senha inválidos",
    });
  }

  // Gera um ID de sessão novo no login (evita "session fixation").
  req.session.regenerate((erro) => {
    if (erro) return next(erro);
    req.session.adminId = admin.id;
    req.session.save(() => res.redirect("/admin"));
  });
});

// ================= Daqui para baixo, SÓ com login =================
adminRouter.use(exigirLogin);

adminRouter.post("/logout", (req, res, next) => {
  req.session.destroy((erro) => {
    if (erro) return next(erro);
    res.clearCookie("connect.sid");
    res.redirect("/admin/login");
  });
});

adminRouter.get("/", async (req, res) => {
  const animais = await prisma.animal.findMany({ orderBy: { createdAt: "desc" } });
  res.render("admin/painel", { titulo: "Painel", animais, mensagem: pegarMensagem(req) });
});

// Marcar como adotado / disponível
adminRouter.post("/animais/:id/adotado", async (req, res, next) => {
  const adotado = req.body?.adotado === "true";
  const resultado = await prisma.animal.updateMany({
    where: { id: req.params.id },
    data: { adotado },
  });
  if (resultado.count === 0) return next(); // não existe → 404

  req.session.mensagem = adotado ? "Animal marcado como adotado" : "Animal marcado como disponível";
  res.redirect("/admin");
});

// Remover
adminRouter.post("/animais/:id/remover", async (req, res, next) => {
  const resultado = await prisma.animal.deleteMany({ where: { id: req.params.id } });
  if (resultado.count === 0) return next();

  // TODO (passo do multer): apagar também o arquivo da foto.
  req.session.mensagem = "Animal removido";
  res.redirect("/admin");
});

// TODO (próximo passo, com zod + multer):
//   GET  /admin/animais/novo
//   POST /admin/animais
//   GET  /admin/animais/:id/editar
//   POST /admin/animais/:id
