import { Router } from "express";
import { env } from "../config/env.js";

import authRoutes from "./auth.routes.js";
import customerRoutes from "./customer.routes.js";
import productRoutes from "./product.routes.js";
import inventoryRoutes from "./inventory.routes.js";
import challanRoutes from "./challan.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

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
router.use("/customers", customerRoutes);
router.use("/products", productRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/challans", challanRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;