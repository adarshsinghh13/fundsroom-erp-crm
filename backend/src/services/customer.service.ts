import { Prisma } from "../../generated/prisma/client.js";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import type {
  CreateCustomerInput,
  CreateFollowUpInput,
  ListCustomersQuery,
  UpdateCustomerInput,
} from "../validations/customer.validation.js";
import type { AuthenticatedUser } from "../types/auth.js";
import type { CustomerWithFollowUps, CustomerListItem, FollowUpWithCreator, PaginatedCustomers } from "../types/customer.js";

const customerSelect = {
  id: true,
  businessName: true,
  contactPerson: true,
  email: true,
  phone: true,
  gstNumber: true,
  address: true,
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
} satisfies Prisma.CustomerSelect;

const followUpSelect = {
  id: true,
  customerId: true,
  note: true,
  followUpDate: true,
  createdById: true,
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  createdAt: true,
} satisfies Prisma.CustomerFollowUpSelect;

export class CustomerService {
  async createCustomer(input: CreateCustomerInput, user: AuthenticatedUser): Promise<CustomerListItem> {
    return prisma.customer.create({
      data: {
        ...input,
        createdById: user.id,
      },
      select: customerSelect,
    });
  }

  async getCustomers(query: ListCustomersQuery): Promise<PaginatedCustomers> {
    console.log("[DEBUG service] Reached CustomerService.getCustomers with query:", query);
    const skip = (query.page - 1) * query.limit;

    const whereCondition: Prisma.CustomerWhereInput = {
      status: query.status,
      OR: query.search
        ? [
            { businessName: { contains: query.search, mode: "insensitive" } },
            { contactPerson: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
            { phone: { contains: query.search, mode: "insensitive" } },
          ]
        : undefined,
    };

    console.log("[DEBUG service] Executing Prisma query findMany and count...");
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where: whereCondition,
        select: customerSelect,
        skip,
        take: query.limit,
        orderBy: this.parseSort(query.sort),
      }),
      prisma.customer.count({ where: whereCondition }),
    ]);

    console.log("[DEBUG service] Prisma returned customers count:", customers.length, "total:", total);

    return {
      data: customers,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    };
  }

  async getCustomerById(id: string): Promise<CustomerWithFollowUps> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: {
        ...customerSelect,
        followUps: {
          select: followUpSelect,
          orderBy: { createdAt: "desc" as const },
        },
      },
    });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    return customer;
  }

  async updateCustomer(id: string, input: UpdateCustomerInput): Promise<CustomerListItem> {
    const customer = await prisma.customer.findUnique({ where: { id } });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    return prisma.customer.update({
      where: { id },
      data: input,
      select: customerSelect,
    });
  }

  async softDeleteCustomer(id: string): Promise<CustomerListItem> {
    const customer = await prisma.customer.findUnique({ where: { id } });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    return prisma.customer.update({
      where: { id },
      data: { status: "INACTIVE" },
      select: customerSelect,
    });
  }

  async createFollowUp(customerId: string, input: CreateFollowUpInput, user: AuthenticatedUser): Promise<FollowUpWithCreator> {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    return prisma.customerFollowUp.create({
      data: {
        customerId,
        note: input.note,
        followUpDate: input.followUpDate,
        createdById: user.id,
      },
      select: followUpSelect,
    });
  }

  async getFollowUps(customerId: string): Promise<FollowUpWithCreator[]> {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    return prisma.customerFollowUp.findMany({
      where: { customerId },
      select: followUpSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  private parseSort(sort: string): Prisma.CustomerOrderByWithRelationInput {
    const isDesc = sort.startsWith("-");
    const field = isDesc ? sort.slice(1) : sort;

    const direction = isDesc ? ("desc" as const) : ("asc" as const);

    if (field === "businessName") {
      return { businessName: direction };
    }

    return { createdAt: direction };
  }
}
