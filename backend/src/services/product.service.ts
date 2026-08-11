import { Prisma } from "../../generated/prisma/client.js";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import type {
  CreateProductInput,
  ListProductsQuery,
  UpdateProductInput,
} from "../validations/product.validation.js";
import type { ProductListItem, ProductDetail, PaginatedProducts } from "../types/product.js";

const productSelect = {
  id: true,
  name: true,
  sku: true,
  description: true,
  category: true,
  unitPrice: true,
  currentStock: true,
  minimumStock: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductSelect;

export class ProductService {
  async createProduct(input: CreateProductInput): Promise<ProductListItem> {
    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku: input.sku },
    });

    if (existingProduct) {
      throw new AppError("Product with this SKU already exists", 409);
    }

    return prisma.product.create({
      data: input,
      select: productSelect,
    });
  }

  async getProducts(query: ListProductsQuery): Promise<PaginatedProducts> {
    const skip = (query.page - 1) * query.limit;

    const whereCondition: Prisma.ProductWhereInput = {
      category: query.category,
      isActive: query.isActive,
      OR: query.search
        ? [
            { name: { contains: query.search, mode: "insensitive" } },
            { sku: { contains: query.search, mode: "insensitive" } },
          ]
        : undefined,
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        select: productSelect,
        skip,
        take: query.limit,
        orderBy: this.parseSort(query.sort),
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    return {
      data: products,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    };
  }

  async getProductById(id: string): Promise<ProductDetail> {
    const product = await prisma.product.findUnique({
      where: { id },
      select: productSelect,
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<ProductListItem> {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    // Check if SKU is being updated and if new SKU already exists
    if (input.sku && input.sku !== product.sku) {
      const existingProduct = await prisma.product.findUnique({
        where: { sku: input.sku },
      });

      if (existingProduct) {
        throw new AppError("Product with this SKU already exists", 409);
      }
    }

    return prisma.product.update({
      where: { id },
      data: input,
      select: productSelect,
    });
  }

  async softDeleteProduct(id: string): Promise<ProductListItem> {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return prisma.product.update({
      where: { id },
      data: { isActive: false },
      select: productSelect,
    });
  }

  private parseSort(sort: string): Prisma.ProductOrderByWithRelationInput {
    const isDesc = sort.startsWith("-");
    const field = isDesc ? sort.slice(1) : sort;

    const direction = isDesc ? ("desc" as const) : ("asc" as const);

    if (field === "name") {
      return { name: direction };
    }

    if (field === "currentStock") {
      return { currentStock: direction };
    }

    return { createdAt: direction };
  }
}
