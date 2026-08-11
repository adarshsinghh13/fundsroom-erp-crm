import type { Request, Response } from "express";

import { AuthService } from "../services/auth.service.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import { AppError } from "../utils/errors.js";

const authService = new AuthService();

export class AuthController {
  register = async (request: Request, response: Response): Promise<void> => {
    const input = registerSchema.parse(request.body);
    const user = await authService.register(input);

    response.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user },
    });
  };

  login = async (request: Request, response: Response): Promise<void> => {
    const input = loginSchema.parse(request.body);
    const result = await authService.login(input);

    response.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  };

  me = async (request: Request, response: Response): Promise<void> => {
    if (!request.user) {
      throw new AppError("Authentication required", 401);
    }

    const user = await authService.getCurrentUser(request.user.id);
    response.status(200).json({
      success: true,
      message: "Current user retrieved successfully",
      data: { user },
    });
  };
}
