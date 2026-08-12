import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";

import { env } from "../config/env.js";

let _prisma: PrismaClient | null = null;

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (prop === 'then') return undefined; // Prevent Promise resolution issues
    if (!_prisma) {
      const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
      _prisma = new PrismaClient({ adapter });
    }
    const value = (_prisma as any)[prop];
    return typeof value === 'function' ? value.bind(_prisma) : value;
  }
});
