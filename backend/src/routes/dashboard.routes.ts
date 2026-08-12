import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
const dashboardController = new DashboardController();

router.get("/stats", authenticate, dashboardController.getDashboardStats);

export default router;
