import "express-session";

declare module "express-session" {
  interface SessionData {
    adminId: string;
    mensagem: string; // aviso mostrado uma vez no painel
  }
}
