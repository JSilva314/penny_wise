"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTransactionSchema,
  type CreateTransactionData,
} from "@/lib/validations/transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
};

type Transaction = {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  date: Date;
  description: string | null;
};

type TransactionFormProps = {
  transaction?: Transaction;
  onSuccess: () => void;
  onCancel: () => void;
};

export function TransactionForm({
  transaction,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!transaction;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<CreateTransactionData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: transaction
      ? {
          amount: Number(transaction.amount),
          type: transaction.type,
          categoryId: transaction.categoryId,
          date: new Date(transaction.date),
          description: transaction.description || "",
        }
      : {
          type: "EXPENSE",
          date: new Date(),
          description: "",
        },
  });

  const selectedType = watch("type");

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  const onSubmit = async (data: CreateTransactionData) => {
    setIsLoading(true);

    try {
      const url = isEditing
        ? `/api/transactions/${transaction.id}`
        : "/api/transactions";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save transaction");
      }

      toast.success(
        isEditing ? "Transaction updated!" : "Transaction created!"
      );
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register("amount", { valueAsNumber: true })}
          disabled={isLoading}
        />
        {errors.amount && (
          <p className="text-sm text-destructive">
            {String(errors.amount.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={selectedType}
          onValueChange={(value) =>
            setValue("type", value as "INCOME" | "EXPENSE")
          }
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-destructive">
            {String(errors.type.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <Select
          value={watch("categoryId")}
          onValueChange={(value) => setValue("categoryId", value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <span className="flex items-center gap-2">
                  {category.icon && <span>{category.icon}</span>}
                  {category.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-sm text-destructive">
            {String(errors.categoryId.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          {...register("date", { valueAsDate: true })}
          defaultValue={format(watch("date") || new Date(), "yyyy-MM-dd")}
          disabled={isLoading}
        />
        {errors.date && (
          <p className="text-sm text-destructive">
            {String(errors.date.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          type="text"
          placeholder="Add a note..."
          {...register("description")}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {String(errors.description.message)}
          </p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (
              isDirty &&
              !confirm(
                "You have unsaved changes. Are you sure you want to cancel?"
              )
            ) {
              return;
            }
            onCancel();
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
