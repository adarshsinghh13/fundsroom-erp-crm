import type { Request, Response } from "express";

import { ProductService } from "../services/product.service.js";
import {
  createProductSchema,
  listProductsSchema,
  updateProductSchema,
} from "../validations/product.validation.js";
import { AppError } from "../utils/errors.js";

const productService = new ProductService();

export class ProductController {
  createProduct = async (request: Request, response: Response): Promise<void> => {
    const input = createProductSchema.parse(request.body);
    const product = await productService.createProduct(input);

    response.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  };

  getProducts = async (request: Request, response: Response): Promise<void> => {
    const query = listProductsSchema.parse(request.query);
    const result = await productService.getProducts(query);

    response.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: result,
    });
  };

  getProductById = async (request: Request, response: Response): Promise<void> => {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const product = await productService.getProductById(id);

    response.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: { product },
    });
  };

  updateProduct = async (request: Request, response: Response): Promise<void> => {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const input = updateProductSchema.parse(request.body);
    const product = await productService.updateProduct(id, input);

    response.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    });
  };

  deleteProduct = async (request: Request, response: Response): Promise<void> => {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const product = await productService.softDeleteProduct(id);

    response.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: { product },
    });
  };
}
