import { Prisma } from "../../generated/prisma/client.js";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import type {
  CreateChallanInput,
  ListChallansQuery,
  UpdateChallanStatusInput,
} from "../validations/challan.validation.js";
import type { AuthenticatedUser } from "../types/auth.js";
import type { ChallanDetail, ChallanListItem, PaginatedChallans } from "../types/challan.js";

const challanSelect = {
  id: true,
  challanNumber: true,
  customerId: true,
  customer: {
    select: {
      id: true,
      businessName: true,
      contactPerson: true,
      email: true,
      phone: true,
    },
  },
  items: {
    select: {
      id: true,
      productId: true,
      productName: true,
      sku: true,
      unitPrice: true,
      quantity: true,
      subtotal: true,
    },
  },
  totalAmount: true,
  status: true,
  createdById: true,
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SalesChallanSelect;

const challanListSelect = {
  id: true,
  challanNumber: true,
  customerId: true,
  customer: {
    select: {
      id: true,
      businessName: true,
    },
  },
  totalAmount: true,
  status: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SalesChallanSelect;

export class ChallanService {
  private async generateChallanNumber(): Promise<string> {
    // Generate unique challan number like CH-20260811-00001
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");

    // Get count of challans created today
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const count = await prisma.salesChallan.count({
      where: {
        createdAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    });

    const sequenceNumber = String(count + 1).padStart(5, "0");
    return `CH-${dateStr}-${sequenceNumber}`;
  }

  async createChallan(input: CreateChallanInput, user: AuthenticatedUser): Promise<ChallanDetail> {
    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: input.customerId },
    });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    // Get all products and validate they exist
    const productIds = input.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== input.items.length) {
      throw new AppError("One or more products not found", 404);
    }

    // Create a map for quick lookups and validate stock availability
    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of input.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new AppError("Product not found", 404);
      }

      if (product.currentStock < item.quantity) {
        throw new AppError(
          `Insufficient stock for product ${product.name}. Available: ${product.currentStock}, Required: ${item.quantity}`,
          400,
        );
      }
    }

    // Generate challan number
    const challanNumber = await this.generateChallanNumber();

    // Calculate items with subtotals
    const itemsWithSubtotals = input.items.map((item) => {
      const product = productMap.get(item.productId)!;
      // Convert unitPrice to number if it's a Decimal, then multiply by quantity
      const unitPriceNum = Number(product.unitPrice);
      const subtotal = unitPriceNum * item.quantity;

      return {
        productId: item.productId,
        productName: product.name,
        sku: product.sku,
        unitPrice: product.unitPrice,
        quantity: item.quantity,
        subtotal,
      };
    });

    // Calculate total amount
    const totalAmount = itemsWithSubtotals.reduce((sum, item) => sum + item.subtotal, 0);

    // Create challan and items in transaction
    const challan = await prisma.$transaction(async (tx) => {
      // Create challan
      const newChallan = await tx.salesChallan.create({
        data: {
          challanNumber,
          customerId: input.customerId,
          totalAmount,
          status: "DRAFT",
          createdById: user.id,
        },
        select: challanSelect,
      });

      // Create challan items
      await tx.salesChallanItem.createMany({
        data: itemsWithSubtotals.map((item) => ({
          challanId: newChallan.id,
          productId: item.productId,
          productName: item.productName,
          sku: item.sku,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
      });

      // Fetch challan with items for response
      return tx.salesChallan.findUniqueOrThrow({
        where: { id: newChallan.id },
        select: challanSelect,
      });
    });

    return challan;
  }

  async getChallans(query: ListChallansQuery): Promise<PaginatedChallans> {
    const skip = (query.page - 1) * query.limit;

    const whereCondition: Prisma.SalesChallanWhereInput = {
      customerId: query.customerId,
      status: query.status,
    };

    const [challans, total] = await Promise.all([
      prisma.salesChallan.findMany({
        where: whereCondition,
        select: challanListSelect,
        skip,
        take: query.limit,
        orderBy: this.parseSort(query.sort),
      }),
      prisma.salesChallan.count({ where: whereCondition }),
    ]);

    return {
      data: challans,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    };
  }

  async getChallanById(id: string): Promise<ChallanDetail> {
    const challan = await prisma.salesChallan.findUnique({
      where: { id },
      select: challanSelect,
    });

    if (!challan) {
      throw new AppError("Challan not found", 404);
    }

    return challan;
  }

  async updateChallanStatus(
    id: string,
    input: UpdateChallanStatusInput,
    user: AuthenticatedUser,
  ): Promise<ChallanDetail> {
    const challan = await prisma.salesChallan.findUnique({
      where: { id },
      include: {
        items: {
          select: {
            productId: true,
            quantity: true,
          },
        },
      },
    });

    if (!challan) {
      throw new AppError("Challan not found", 404);
    }

    if (input.status === "CONFIRMED") {
      // Validate transition from DRAFT to CONFIRMED only
      if (challan.status !== "DRAFT") {
        throw new AppError("Only DRAFT challans can be confirmed", 400);
      }

      // Verify stock is still available
      const products = await prisma.product.findMany({
        where: {
          id: { in: challan.items.map((item) => item.productId) },
        },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));

      for (const item of challan.items) {
        const product = productMap.get(item.productId);
        if (!product || product.currentStock < item.quantity) {
          throw new AppError(
            `Insufficient stock for product. Current stock validation failed.`,
            400,
          );
        }
      }

      // Update status to CONFIRMED and create stock movements in transaction
      const updatedChallan = await prisma.$transaction(async (tx) => {
        // Update challan status
        await tx.salesChallan.update({
          where: { id },
          data: { status: "CONFIRMED" },
        });

        // Deduct stock for each item
        for (const item of challan.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              currentStock: {
                decrement: item.quantity,
              },
            },
          });

          // Create stock movement (OUT)
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              quantity: item.quantity,
              type: "OUT",
              reason: `Sales Challan ${challan.challanNumber}`,
              createdById: user.id,
            },
          });
        }

        // Fetch updated challan
        return tx.salesChallan.findUniqueOrThrow({
          where: { id },
          select: challanSelect,
        });
      });

      return updatedChallan;
    }

    if (input.status === "CANCELLED") {
      // Can only cancel DRAFT or CONFIRMED
      if (challan.status === "CANCELLED") {
        throw new AppError("Challan is already cancelled", 400);
      }

      // If CONFIRMED, restore stock; if DRAFT, just mark as cancelled
      const updatedChallan = await prisma.$transaction(async (tx) => {
        // Update challan status
        await tx.salesChallan.update({
          where: { id },
          data: { status: "CANCELLED" },
        });

        // If it was confirmed, restore stock
        if (challan.status === "CONFIRMED") {
          for (const item of challan.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                currentStock: {
                  increment: item.quantity,
                },
              },
            });

            // Create stock movement (IN)
            await tx.stockMovement.create({
              data: {
                productId: item.productId,
                quantity: item.quantity,
                type: "IN",
                reason: `Challan Cancellation ${challan.challanNumber}`,
                createdById: user.id,
              },
            });
          }
        }

        // Fetch updated challan
        return tx.salesChallan.findUniqueOrThrow({
          where: { id },
          select: challanSelect,
        });
      });

      return updatedChallan;
    }

    throw new AppError("Invalid status transition", 400);
  }

  async deleteChallan(id: string): Promise<ChallanDetail> {
    const challan = await prisma.salesChallan.findUnique({
      where: { id },
    });

    if (!challan) {
      throw new AppError("Challan not found", 404);
    }

    if (challan.status === "CONFIRMED") {
      throw new AppError("Cannot delete a confirmed challan. Cancel it instead.", 400);
    }

    // Soft delete by setting status to CANCELLED
    const deletedChallan = await prisma.salesChallan.update({
      where: { id },
      data: { status: "CANCELLED" },
      select: challanSelect,
    });

    return deletedChallan;
  }

  private parseSort(sort: string): Prisma.SalesChallanOrderByWithRelationInput {
    const isDesc = sort.startsWith("-");
    const field = isDesc ? sort.slice(1) : sort;

    const direction = isDesc ? ("desc" as const) : ("asc" as const);

    return { createdAt: direction };
  }
}
