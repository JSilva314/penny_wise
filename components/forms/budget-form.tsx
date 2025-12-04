"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createBudgetSchema,
  type CreateBudgetData,
} from "@/lib/validations/budget";
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

type Budget = {
  id: string;
  name: string;
  amount: number;
  period: "MONTHLY" | "QUARTERLY" | "YEARLY";
  startDate: Date;
  categories: Category[];
};

type BudgetFormProps = {
  budget?: Budget;
  onSuccess: () => void;
  onCancel: () => void;
};

export function BudgetForm({ budget, onSuccess, onCancel }: BudgetFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    budget?.categories.map((c) => c.id) || []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<CreateBudgetData>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: budget
      ? {
          name: budget.name,
          amount: Number(budget.amount),
          period: budget.period,
          startDate: new Date(budget.startDate),
          categoryIds: budget.categories.map((c) => c.id),
        }
      : {
          period: "MONTHLY",
          startDate: new Date(),
          categoryIds: [],
        },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryToggle = (categoryId: string) => {
    const newSelection = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter((id) => id !== categoryId)
      : [...selectedCategoryIds, categoryId];

    setSelectedCategoryIds(newSelection);
    setValue("categoryIds", newSelection, { shouldDirty: true });
  };

  const onSubmit = async (data: CreateBudgetData) => {
    setIsLoading(true);
    try {
      const url = budget ? `/api/budgets/${budget.id}` : "/api/budgets";
      const method = budget ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save budget");

      toast.success(budget ? "Budget updated!" : "Budget created!");
      onSuccess();
    } catch (error) {
      toast.error(
        budget ? "Failed to update budget" : "Failed to create budget"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      if (
        confirm("You have unsaved changes. Are you sure you want to cancel?")
      ) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Budget Name</Label>
        <Input
          id="name"
          placeholder="Monthly Groceries"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="500.00"
          {...register("amount", { valueAsNumber: true })}
        />
        {errors.amount && (
          <p className="text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="period">Period</Label>
        <Select
          defaultValue={watch("period")}
          onValueChange={(value) =>
            setValue("period", value as "MONTHLY" | "QUARTERLY" | "YEARLY", {
              shouldDirty: true,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MONTHLY">Monthly</SelectItem>
            <SelectItem value="QUARTERLY">Quarterly</SelectItem>
            <SelectItem value="YEARLY">Yearly</SelectItem>
          </SelectContent>
        </Select>
        {errors.period && (
          <p className="text-sm text-red-600">{errors.period.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={format(watch("startDate") || new Date(), "yyyy-MM-dd")}
          onChange={(e) =>
            setValue("startDate", new Date(e.target.value), {
              shouldDirty: true,
            })
          }
        />
        {errors.startDate && (
          <p className="text-sm text-red-600">{errors.startDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Categories ({selectedCategoryIds.length} selected)</Label>
        <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-accent"
            >
              <input
                type="checkbox"
                checked={selectedCategoryIds.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <div className="flex items-center gap-2">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded text-sm"
                  style={{
                    backgroundColor: category.color
                      ? `${category.color}20`
                      : undefined,
                  }}
                >
                  {category.icon || "📁"}
                </span>
                <span>{category.name}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.categoryIds && (
          <p className="text-sm text-red-600">{errors.categoryIds.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancelClick}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : budget ? "Update Budget" : "Create Budget"}
        </Button>
      </div>
    </form>
  );
}
