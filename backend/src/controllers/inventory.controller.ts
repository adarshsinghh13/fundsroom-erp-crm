import type { Request, Response } from "express";

import { InventoryService } from "../services/inventory.service.js";
import {
  stockInSchema,
  stockOutSchema,
  listMovementsSchema,
} from "../validations/inventory.validation.js";
import { AppError } from "../utils/errors.js";

const inventoryService = new InventoryService();

export class InventoryController {
  stockIn = async (request: Request, response: Response): Promise<void> => {
    if (!request.user) {
      throw new AppError("Authentication required", 401);
    }

    const input = stockInSchema.parse(request.body);
    const movement = await inventoryService.stockIn(input, request.user);

    response.status(201).json({
      success: true,
      message: "Stock added successfully",
      data: { movement },
    });
  };

  stockOut = async (request: Request, response: Response): Promise<void> => {
    if (!request.user) {
      throw new AppError("Authentication required", 401);
    }

    const input = stockOutSchema.parse(request.body);
    const movement = await inventoryService.stockOut(input, request.user);

    response.status(201).json({
      success: true,
      message: "Stock removed successfully",
      data: { movement },
    });
  };

  getMovements = async (request: Request, response: Response): Promise<void> => {
    const query = listMovementsSchema.parse(request.query);
    const result = await inventoryService.getMovements(query);

    response.status(200).json({
      success: true,
      message: "Stock movements retrieved successfully",
      data: result,
    });
  };

  getLowStockProducts = async (request: Request, response: Response): Promise<void> => {
    const products = await inventoryService.getLowStockProducts();

    response.status(200).json({
      success: true,
      message: "Low stock products retrieved successfully",
      data: { products },
    });
  };
}
