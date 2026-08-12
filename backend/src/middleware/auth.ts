import type { RequestHandler } from "express";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticate: RequestHandler = async (request, _response, next) => {
  try {
    const authorization = request.header("Authorization");
    console.log("[DEBUG auth] Route reached:", request.originalUrl, "Method:", request.method);
    console.log("[DEBUG auth] Authorization Header:", authorization);

    const [scheme, token] = authorization?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
      console.log("[DEBUG auth] Missing or invalid scheme/token scheme:", scheme, "token:", token);
      throw new AppError("Authentication required", 401);
    }

    const payload = verifyToken(token);
    console.log("[DEBUG auth] JWT payload:", payload);

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
      console.log("[DEBUG auth] User not found for payload.sub:", payload.sub);
      throw new AppError("Authentication required", 401);
    }

    request.user = user;
    console.log("[DEBUG auth] request.user set:", request.user);
    next();
  } catch (error) {
    console.log("[DEBUG auth] Error caught in authenticate middleware:", error);
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
