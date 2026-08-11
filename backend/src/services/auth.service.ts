import { Prisma } from "../../generated/prisma/client.js";
import type { UserRole } from "../../generated/prisma/enums.js";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import { generateToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import type { LoginInput, RegisterInput } from "../validations/auth.validation.js";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

type PublicUser = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;

export class AuthService {
  async register(input: RegisterInput): Promise<PublicUser> {
    const password = await hashPassword(input.password);

    try {
      return await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password,
          role: "EMPLOYEE",
        },
        select: publicUserSelect,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError("An account with this email already exists", 409);
      }

      throw error;
    }
  }

  async login(input: LoginInput): Promise<{ token: string; user: PublicUser }> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      select: {
        ...publicUserSelect,
        password: true,
      },
    });

    if (!user || !(await comparePassword(input.password, user.password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const { password: _password, ...publicUser } = user;
    return {
      token: generateToken({ sub: publicUser.id, role: publicUser.role as UserRole }),
      user: publicUser,
    };
  }

  async getCurrentUser(userId: string): Promise<PublicUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: publicUserSelect,
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}
