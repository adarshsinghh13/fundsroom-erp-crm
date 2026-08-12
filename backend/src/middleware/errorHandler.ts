import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { AppError } from "../utils/errors.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  console.log("[DEBUG errorHandler] Error caught:", error);
  if (error instanceof ZodError) {
    console.log("[DEBUG errorHandler] ZodError details:", error.flatten().fieldErrors);
    response.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.flatten().fieldErrors,
    });
    return;
  }

  if (error instanceof AppError) {
    console.log("[DEBUG errorHandler] AppError status:", error.statusCode, "message:", error.message);
    response.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  console.error(error);
  response.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
