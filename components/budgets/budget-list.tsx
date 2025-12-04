"use client";

import { BudgetCard } from "./budget-card";

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

type BudgetListProps = {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
};

export function BudgetList({
  budgets,
  onEdit,
  onDelete,
  isLoading,
}: BudgetListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No budgets found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first budget to start tracking your spending
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
