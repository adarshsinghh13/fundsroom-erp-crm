import type * as Prisma from "../../generated/prisma/internal/prismaNamespace.js";

export type CustomerWithFollowUps = Prisma.CustomerGetPayload<{
  include: { followUps: { include: { createdBy: { select: { id: true; name: true; email: true } } } }; createdBy: { select: { id: true; name: true; email: true } } };
}>;

export type CustomerListItem = Prisma.CustomerGetPayload<{
  select: {
    id: true;
    businessName: true;
    contactPerson: true;
    email: true;
    phone: true;
    gstNumber: true;
    address: true;
    status: true;
    createdById: true;
    createdBy: { select: { id: true; name: true; email: true } };
    createdAt: true;
    updatedAt: true;
  };
}>;

export type FollowUpWithCreator = Prisma.CustomerFollowUpGetPayload<{
  select: {
    id: true;
    customerId: true;
    note: true;
    followUpDate: true;
    createdById: true;
    createdBy: { select: { id: true; name: true; email: true } };
    createdAt: true;
  };
}>;

export type PaginatedCustomers = {
  data: CustomerListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};
