import type * as Prisma from "../../generated/prisma/internal/prismaNamespace.js";

export type ProductListItem = Prisma.ProductGetPayload<{
  select: {
    id: true;
    name: true;
    sku: true;
    description: true;
    category: true;
    unitPrice: true;
    currentStock: true;
    minimumStock: true;
    isActive: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export type ProductDetail = Prisma.ProductGetPayload<{
  select: {
    id: true;
    name: true;
    sku: true;
    description: true;
    category: true;
    unitPrice: true;
    currentStock: true;
    minimumStock: true;
    isActive: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export type PaginatedProducts = {
  data: ProductListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};
