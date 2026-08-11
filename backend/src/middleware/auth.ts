import type { RequestHandler } from "express";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticate: RequestHandler = async (request, _response, next) => {
  try {
    const authorization = request.header("Authorization");
    const [scheme, token] = authorization?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
      throw new AppError("Authentication required", 401);
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new AppError("Authentication required", 401);
    }

    request.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
      next(new AppError("Invalid or expired token", 401));
      return;
    }

    next(error);
  }
};
