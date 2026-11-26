import type { Request, Response, NextFunction } from "express";

// Deixa passar só quem fez login. Quem não fez é mandado para a tela de login.
export function exigirLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.adminId) {
    return res.redirect("/admin/login");
  }

  next();
}
