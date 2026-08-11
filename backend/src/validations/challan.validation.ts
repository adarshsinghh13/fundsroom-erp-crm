import { z } from "zod";

export const challanItemSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.coerce.number().int().min(1),
});

export const createChallanSchema = z.object({
  customerId: z.string().trim().min(1),
  items: z.array(challanItemSchema).min(1),
});

export const updateChallanStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED"]),
});

export const listChallansSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  customerId: z.string().trim().optional(),
  status: z.enum(["DRAFT", "CONFIRMED", "CANCELLED"]).optional(),
  sort: z.enum(["createdAt", "-createdAt"]).default("-createdAt"),
});

export type ChallanItemInput = z.infer<typeof challanItemSchema>;
export type CreateChallanInput = z.infer<typeof createChallanSchema>;
export type UpdateChallanStatusInput = z.infer<typeof updateChallanStatusSchema>;
export type ListChallansQuery = z.infer<typeof listChallansSchema>;
