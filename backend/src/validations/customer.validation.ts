import { z } from "zod";

export const createCustomerSchema = z.object({
  businessName: z.string().trim().min(2).max(200),
  contactPerson: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
  gstNumber: z.string().trim().max(15).optional().nullable(),
  address: z.string().trim().max(1000).optional().nullable(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const createFollowUpSchema = z.object({
  note: z.string().trim().min(1).max(5000),
  followUpDate: z.coerce.date().optional().nullable(),
});

export const listCustomersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  sort: z.enum(["businessName", "createdAt", "-businessName", "-createdAt"]).default("createdAt"),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CreateFollowUpInput = z.infer<typeof createFollowUpSchema>;
export type ListCustomersQuery = z.infer<typeof listCustomersSchema>;
