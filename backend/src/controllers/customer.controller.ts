import type { Request, Response } from "express";

import { CustomerService } from "../services/customer.service.js";
import {
  createCustomerSchema,
  createFollowUpSchema,
  listCustomersSchema,
  updateCustomerSchema,
} from "../validations/customer.validation.js";
import { AppError } from "../utils/errors.js";

const customerService = new CustomerService();

export class CustomerController {
  createCustomer = async (request: Request, response: Response): Promise<void> => {
    if (!request.user) {
      throw new AppError("Authentication required", 401);
    }

    const input = createCustomerSchema.parse(request.body);
    const customer = await customerService.createCustomer(input, request.user);

    response.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: { customer },
    });
  };

  getCustomers = async (request: Request, response: Response): Promise<void> => {
    console.log("[DEBUG controller] Reached getCustomers controller. request.user:", request.user, "request.query:", request.query);
    const query = listCustomersSchema.parse(request.query);
    console.log("[DEBUG controller] Parsed query schema successfully:", query);
    const result = await customerService.getCustomers(query);
    console.log("[DEBUG controller] Service returned result successfully.");

    response.status(200).json({
      success: true,
      message: "Customers retrieved successfully",
      data: result,
    });
  };

  getCustomerById = async (request: Request, response: Response): Promise<void> => {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const customer = await customerService.getCustomerById(id);

    response.status(200).json({
      success: true,
      message: "Customer retrieved successfully",
      data: { customer },
    });
  };

  updateCustomer = async (request: Request, response: Response): Promise<void> => {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const input = updateCustomerSchema.parse(request.body);
    const customer = await customerService.updateCustomer(id, input);

    response.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: { customer },
    });
  };

  deleteCustomer = async (request: Request, response: Response): Promise<void> => {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const customer = await customerService.softDeleteCustomer(id);

    response.status(200).json({
      success: true,
      message: "Customer deleted successfully",
      data: { customer },
    });
  };

  createFollowUp = async (request: Request, response: Response): Promise<void> => {
    if (!request.user) {
      throw new AppError("Authentication required", 401);
    }

    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const input = createFollowUpSchema.parse(request.body);
    const followUp = await customerService.createFollowUp(id, input, request.user);

    response.status(201).json({
      success: true,
      message: "Follow-up created successfully",
      data: { followUp },
    });
  };

  getFollowUps = async (request: Request, response: Response): Promise<void> => {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const followUps = await customerService.getFollowUps(id);

    response.status(200).json({
      success: true,
      message: "Follow-ups retrieved successfully",
      data: { followUps },
    });
  };
}
