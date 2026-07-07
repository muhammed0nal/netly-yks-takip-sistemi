import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib/errors.js";
import { verifyAccessToken } from "../lib/jwt.js";
import { prisma } from "../lib/prisma.js";

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      throw new HttpError(401, "Oturum açmanız gerekiyor");
    }

    const token = header.slice("Bearer ".length).trim();

    if (!token) {
      throw new HttpError(401, "Oturum açmanız gerekiyor");
    }

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new HttpError(401, "Oturum geçersiz");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof HttpError) {
      next(error);
      return;
    }

    next(new HttpError(401, "Oturum geçersiz veya süresi dolmuş"));
  }
}
