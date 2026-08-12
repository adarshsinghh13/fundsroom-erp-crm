import type { RequestHandler } from "express";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticate: RequestHandler = async (request, _response, next) => {
  try {
    // Auth bypassed for development/preview
    request.user = {
      id: "mock-admin-id",
      name: "Admin User",
      email: "admin@fundsroom.com",
      role: "ADMIN",
    };
    next();
  } catch (error) {
    next(error);
  }
};
