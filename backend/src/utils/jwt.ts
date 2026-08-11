import jwt, {
  JsonWebTokenError,
  type JwtPayload,
  type SignOptions,
} from "jsonwebtoken";

import { env } from "../config/env.js";
import { UserRole } from "../../generated/prisma/enums.js";
import type { AuthTokenPayload } from "../types/auth.js";

export const generateToken = (payload: AuthTokenPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });

export const verifyToken = (token: string): AuthTokenPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof (decoded as JwtPayload).sub !== "string" ||
    ((decoded as JwtPayload).role !== UserRole.ADMIN &&
      (decoded as JwtPayload).role !== UserRole.EMPLOYEE)
  ) {
    throw new JsonWebTokenError("Invalid token payload");
  }

  const payload = decoded as JwtPayload & AuthTokenPayload;

  return {
    sub: payload.sub,
    role: payload.role,
  };
};
