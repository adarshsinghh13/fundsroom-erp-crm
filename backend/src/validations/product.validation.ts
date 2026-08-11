import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(200),
  sku: z.string().trim().min(1).max(100),
  description: z.string().trim().max(5000).optional().nullable(),
  category: z.enum(["ELECTRONICS", "HARDWARE", "OFFICE", "OTHER"]).optional().nullable(),
  unitPrice: z.coerce.number().positive(),
  currentStock: z.coerce.number().int().min(0).default(0),
  minimumStock: z.coerce.number().int().min(0).default(0),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  category: z.enum(["ELECTRONICS", "HARDWARE", "OFFICE", "OTHER"]).optional(),
  isActive: z.coerce.boolean().optional(),
  sort: z.enum(["name", "createdAt", "currentStock", "-name", "-createdAt", "-currentStock"]).default("createdAt"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsSchema>;
