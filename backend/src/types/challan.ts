import type * as Prisma from "../../generated/prisma/internal/prismaNamespace.js";

export type ChallanItemDetail = Prisma.SalesChallanItemGetPayload<{
  select: {
    id: true;
    productId: true;
    productName: true;
    sku: true;
    unitPrice: true;
    quantity: true;
    subtotal: true;
  };
}>;

export type ChallanDetail = Prisma.SalesChallanGetPayload<{
  select: {
    id: true;
    challanNumber: true;
    customerId: true;
    customer: {
      select: {
        id: true;
        businessName: true;
        contactPerson: true;
        email: true;
        phone: true;
      };
    };
    items: {
      select: {
        id: true;
        productId: true;
        productName: true;
        sku: true;
        unitPrice: true;
        quantity: true;
        subtotal: true;
      };
    };
    totalAmount: true;
    status: true;
    createdById: true;
    createdBy: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    createdAt: true;
    updatedAt: true;
  };
}>;

export type ChallanListItem = Prisma.SalesChallanGetPayload<{
  select: {
    id: true;
    challanNumber: true;
    customerId: true;
    customer: {
      select: {
        id: true;
        businessName: true;
      };
    };
    totalAmount: true;
    status: true;
    createdById: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export type PaginatedChallans = {
  data: ChallanListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};
