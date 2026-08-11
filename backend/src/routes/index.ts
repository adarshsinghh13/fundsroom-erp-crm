import { Router } from "express";
import { env } from "../config/env.js";

import authRoutes from "./auth.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Fundsroom ERP API is running",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);

export default router;