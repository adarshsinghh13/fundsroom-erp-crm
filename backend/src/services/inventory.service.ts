import { Prisma } from "../../generated/prisma/client.js";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import type {
  StockInInput,
  StockOutInput,
  ListMovementsQuery,
} from "../validations/inventory.validation.js";
import type { AuthenticatedUser } from "../types/auth.js";
import type { StockMovementWithProduct, PaginatedMovements, LowStockProduct } from "../types/inventory.js";

const stockMovementSelect = {
  id: true,
  productId: true,
  product: {
    select: {
      id: true,
      name: true,
      sku: true,
      unitPrice: true,
      currentStock: true,
      isActive: true,
    },
  },
  quantity: true,
  type: true,
  reason: true,
  createdById: true,
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  createdAt: true,
} satisfies Prisma.StockMovementSelect;

const lowStockProductSelect = {
  id: true,
  name: true,
  sku: true,
  category: true,
  currentStock: true,
  minimumStock: true,
  isActive: true,
  createdAt: true,
} satisfies Prisma.ProductSelect;

export class InventoryService {
  async stockIn(input: StockInInput, user: AuthenticatedUser): Promise<StockMovementWithProduct> {
    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: input.productId },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    // Use transaction to update both product stock and create movement
    const result = await prisma.$transaction(async (tx) => {
      // Update product stock
      await tx.product.update({
        where: { id: input.productId },
        data: {
          currentStock: {
            increment: input.quantity,
          },
        },
      });

      // Create stock movement record
      return tx.stockMovement.create({
        data: {
          productId: input.productId,
          quantity: input.quantity,
          type: "IN",
          reason: input.reason,
          createdById: user.id,
        },
        select: stockMovementSelect,
      });
    });

    return result;
  }

  async stockOut(input: StockOutInput, user: AuthenticatedUser): Promise<StockMovementWithProduct> {
    // Verify product exists and has sufficient stock
    const product = await prisma.product.findUnique({
      where: { id: input.productId },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.currentStock < input.quantity) {
      throw new AppError(
        `Insufficient stock. Available: ${product.currentStock}, Required: ${input.quantity}`,
        400,
      );
    }

    // Use transaction to update both product stock and create movement
    const result = await prisma.$transaction(async (tx) => {
      // Update product stock
      await tx.product.update({
        where: { id: input.productId },
        data: {
          currentStock: {
            decrement: input.quantity,
          },
        },
      });

      // Create stock movement record
      return tx.stockMovement.create({
        data: {
          productId: input.productId,
          quantity: input.quantity,
          type: "OUT",
          reason: input.reason,
          createdById: user.id,
        },
        select: stockMovementSelect,
      });
    });

    return result;
  }

  async getMovements(query: ListMovementsQuery): Promise<PaginatedMovements> {
    const skip = (query.page - 1) * query.limit;

    const whereCondition: Prisma.StockMovementWhereInput = {
      productId: query.productId,
      type: query.type,
    };

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where: whereCondition,
        select: stockMovementSelect,
        skip,
        take: query.limit,
        orderBy: this.parseSort(query.sort),
      }),
      prisma.stockMovement.count({ where: whereCondition }),
    ]);

    return {
      data: movements,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    };
  }

  async getLowStockProducts(): Promise<LowStockProduct[]> {
    // Get all active products and filter in memory
    // Note: Prisma doesn't support comparing two columns directly in findMany
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: lowStockProductSelect,
    });

    return products
      .filter((product) => product.currentStock <= product.minimumStock)
      .sort((a, b) => a.currentStock - b.currentStock);
  }

  private parseSort(sort: string): Prisma.StockMovementOrderByWithRelationInput {
    const isDesc = sort.startsWith("-");
    const field = isDesc ? sort.slice(1) : sort;

    const direction = isDesc ? ("desc" as const) : ("asc" as const);

    return { createdAt: direction };
  }
}
