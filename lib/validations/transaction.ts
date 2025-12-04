import { z } from "zod";

// Transaction type enum matching Prisma schema
export const TransactionTypeEnum = z.enum(["INCOME", "EXPENSE"]);

// Schema for creating a transaction
export const createTransactionSchema = z.object({
  amount: z
    .number()
    .positive({ message: "Amount must be greater than 0" })
    .refine((val) => Number(val.toFixed(2)) === val, {
      message: "Amount must have at most 2 decimal places",
    }),
  type: TransactionTypeEnum,
  categoryId: z.string().cuid({ message: "Invalid category ID" }),
  date: z.date(),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional()
    .or(z.literal("")),
});

// Schema for updating a transaction (all fields optional except id)
export const updateTransactionSchema = createTransactionSchema.partial();

// Schema for filtering transactions
export const transactionFilterSchema = z.object({
  type: TransactionTypeEnum.optional(),
  categoryId: z.string().cuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().optional(),
  limit: z.number().positive().max(100).default(20),
  offset: z.number().nonnegative().default(0),
});

// Type exports
export type CreateTransactionData = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionData = z.infer<typeof updateTransactionSchema>;
export type TransactionFilterData = z.infer<typeof transactionFilterSchema>;
