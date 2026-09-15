import type { Request, Response, NextFunction } from "express";

export function exigirLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.adminId) {
    return res.status(401).json({ erro: "Você precisa estar logado" });
  }

  next();
}