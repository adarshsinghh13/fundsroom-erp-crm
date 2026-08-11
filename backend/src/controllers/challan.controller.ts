import type { Request, Response } from "express";

import { ChallanService } from "../services/challan.service.js";
import {
  createChallanSchema,
  listChallansSchema,
  updateChallanStatusSchema,
} from "../validations/challan.validation.js";
import { AppError } from "../utils/errors.js";

const challanService = new ChallanService();

export class ChallanController {
  createChallan = async (request: Request, response: Response): Promise<void> => {
    if (!request.user) {
      throw new AppError("Authentication required", 401);
    }

    const input = createChallanSchema.parse(request.body);
    const challan = await challanService.createChallan(input, request.user);

    response.status(201).json({
      success: true,
      message: "Challan created successfully",
      data: { challan },
    });
  };

  getChallans = async (request: Request, response: Response): Promise<void> => {
    const query = listChallansSchema.parse(request.query);
    const result = await challanService.getChallans(query);

    response.status(200).json({
      success: true,
      message: "Challans retrieved successfully",
      data: result,
    });
  };

  getChallanById = async (request: Request, response: Response): Promise<void> => {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const challan = await challanService.getChallanById(id);

    response.status(200).json({
      success: true,
      message: "Challan retrieved successfully",
      data: { challan },
    });
  };

  updateChallanStatus = async (request: Request, response: Response): Promise<void> => {
    if (!request.user) {
      throw new AppError("Authentication required", 401);
    }

    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const input = updateChallanStatusSchema.parse(request.body);
    const challan = await challanService.updateChallanStatus(id, input, request.user);

    response.status(200).json({
      success: true,
      message: "Challan status updated successfully",
      data: { challan },
    });
  };

  deleteChallan = async (request: Request, response: Response): Promise<void> => {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const challan = await challanService.deleteChallan(id);

    response.status(200).json({
      success: true,
      message: "Challan cancelled successfully",
      data: { challan },
    });
  };
}
