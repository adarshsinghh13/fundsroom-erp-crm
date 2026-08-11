import { z } from "zod";

export const stockInSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.coerce.number().int().min(1),
  reason: z.string().trim().max(255).optional().nullable(),
});

export const stockOutSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.coerce.number().int().min(1),
  reason: z.string().trim().max(255).optional().nullable(),
});

export const listMovementsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  productId: z.string().trim().optional(),
  type: z.enum(["IN", "OUT"]).optional(),
  sort: z.enum(["createdAt", "-createdAt"]).default("-createdAt"),
});

export type StockInInput = z.infer<typeof stockInSchema>;
export type StockOutInput = z.infer<typeof stockOutSchema>;
export type ListMovementsQuery = z.infer<typeof listMovementsSchema>;
