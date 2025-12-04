import { z } from "zod";

// Budget period enum matching Prisma schema
export const BudgetPeriodEnum = z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]);

// Schema for creating a budget
export const createBudgetSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  amount: z
    .number()
    .positive({ message: "Amount must be greater than 0" })
    .refine((val) => Number(val.toFixed(2)) === val, {
      message: "Amount must have at most 2 decimal places",
    }),
  period: BudgetPeriodEnum,
  startDate: z.date(),
  categoryIds: z
    .array(z.string().cuid({ message: "Invalid category ID" }))
    .min(1, { message: "At least one category is required" }),
});

// Schema for updating a budget
export const updateBudgetSchema = createBudgetSchema.partial();

// Schema for filtering budgets
export const budgetFilterSchema = z.object({
  period: BudgetPeriodEnum.optional(),
  status: z.enum(["active", "exceeded", "completed"]).optional(),
  search: z.string().optional(),
});

// Type exports
export type CreateBudgetData = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetData = z.infer<typeof updateBudgetSchema>;
export type BudgetFilterData = z.infer<typeof budgetFilterSchema>;
