"use client";

import { Pencil, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BudgetProgress } from "./budget-progress";
import { cn } from "@/lib/utils";
import { differenceInDays } from "date-fns";

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
  startDate: Date | string;
  endDate: Date | string;
  spent: number;
  remaining: number;
  percentage: number;
  status: string;
  categories: Category[];
};

type BudgetCardProps = {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
};

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const endDate =
    typeof budget.endDate === "string"
      ? new Date(budget.endDate)
      : budget.endDate;
  const daysRemaining = differenceInDays(endDate, new Date());
  const isActive = budget.status === "active";
  const isExceeded = budget.status === "exceeded";

  return (
    <div className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent/50">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{budget.name}</h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                isExceeded && "bg-red-100 text-red-700",
                isActive && "bg-green-100 text-green-700",
                budget.status === "completed" && "bg-slate-100 text-slate-700"
              )}
            >
              {budget.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {budget.period.charAt(0) + budget.period.slice(1).toLowerCase()}{" "}
            Budget
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(budget)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(budget.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <BudgetProgress
        spent={budget.spent}
        amount={budget.amount}
        percentage={budget.percentage}
      />

      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <div className="flex flex-wrap gap-2">
          {budget.categories.slice(0, 3).map((category) => (
            <span
              key={category.id}
              className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs"
              style={{
                backgroundColor: category.color
                  ? `${category.color}20`
                  : undefined,
              }}
            >
              <span>{category.icon || "📁"}</span>
              <span>{category.name}</span>
            </span>
          ))}
          {budget.categories.length > 3 && (
            <span className="flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
              +{budget.categories.length - 3} more
            </span>
          )}
        </div>
        {isActive && daysRemaining >= 0 && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{daysRemaining} days left</span>
          </div>
        )}
      </div>
    </div>
  );
}
