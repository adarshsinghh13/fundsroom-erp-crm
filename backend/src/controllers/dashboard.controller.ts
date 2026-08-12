import type { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service.js";

const dashboardService = new DashboardService();

export class DashboardController {
  getDashboardStats = async (request: Request, response: Response): Promise<void> => {
    const data = await dashboardService.getStats();

    response.status(200).json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data,
    });
  };
}
