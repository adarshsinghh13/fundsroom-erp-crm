import type * as Prisma from "../../generated/prisma/internal/prismaNamespace.js";

export type StockMovementWithProduct = Prisma.StockMovementGetPayload<{
  select: {
    id: true;
    productId: true;
    product: {
      select: {
        id: true;
        name: true;
        sku: true;
        unitPrice: true;
        currentStock: true;
        isActive: true;
      };
    };
    quantity: true;
    type: true;
    reason: true;
    createdById: true;
    createdBy: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    createdAt: true;
  };
}>;

export type PaginatedMovements = {
  data: StockMovementWithProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export type LowStockProduct = Prisma.ProductGetPayload<{
  select: {
    id: true;
    name: true;
    sku: true;
    category: true;
    currentStock: true;
    minimumStock: true;
    isActive: true;
    createdAt: true;
  };
}>;
