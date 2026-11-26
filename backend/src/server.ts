import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { publicRouter } from "./routes/public.js";
import { adminRouter } from "./routes/admin.js";

// ---------- Configuração (vem do .env) ----------
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  // Sem segredo, qualquer um poderia forjar o cookie de sessão. Melhor nem iniciar.
  throw new Error("Defina SESSION_SECRET no arquivo .env (veja o .env.example)");
}
const PORT = Number(process.env.PORT) || 3000;
const emProducao = process.env.NODE_ENV === "production";

// Pastas (caminhos calculados a partir deste arquivo: backend/src/)
const PASTA_VIEWS = path.join(import.meta.dirname, "../../frontend/views");
const PASTA_PUBLIC = path.join(import.meta.dirname, "../../frontend/public");
const PASTA_UPLOADS = path.join(import.meta.dirname, "../../uploads");
fs.mkdirSync(PASTA_UPLOADS, { recursive: true });

const app = express();

// ---------- EJS ----------
app.set("view engine", "ejs");
app.set("views", PASTA_VIEWS);

// ---------- Leitura do corpo das requisições ----------
app.use(express.urlencoded({ extended: true })); // formulários HTML
app.use(express.json()); // JSON (Insomnia, por exemplo)

// ---------- Arquivos estáticos ----------
app.use(express.static(PASTA_PUBLIC)); // /css/style.css, /img/logo.png...
app.use("/uploads", express.static(PASTA_UPLOADS)); // fotos dos animais

// ---------- Sessão ----------
// Em produção a hospedagem fica atrás de um proxy HTTPS; isso permite o cookie "secure".
if (emProducao) app.set("trust proxy", 1);

// As sessões ficam guardadas no próprio Postgres (tabela "session", criada sozinha),
// então o admin não é deslogado quando o servidor reinicia.
const PgStore = connectPgSimple(session);

app.use(
  session({
    store: new PgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 dia
      httpOnly: true, // JavaScript da página não consegue ler o cookie
      sameSite: "lax", // outros sites não conseguem enviar formulários usando o cookie
      secure: emProducao, // só envia o cookie por HTTPS em produção
    },
  })
);

// ---------- Rotas ----------
app.use(publicRouter);
app.use("/admin", adminRouter);

// ---------- 404: nenhuma rota respondeu ----------
app.use((req: Request, res: Response) => {
  res.status(404).render("publico/404", { titulo: "Página não encontrada" });
});

// ---------- Erros inesperados ----------
// O Express 5 manda para cá qualquer erro lançado dentro das rotas (inclusive async).
app.use((erro: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error(erro);
  res.status(500).send("Ocorreu um erro inesperado. Tente novamente mais tarde.");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
