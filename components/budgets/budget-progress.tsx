"use client";

import { cn } from "@/lib/utils";

type BudgetProgressProps = {
  spent: number;
  amount: number;
  percentage: number;
};

export function BudgetProgress({
  spent,
  amount,
  percentage,
}: BudgetProgressProps) {
  const remaining = amount - spent;
  const isExceeded = spent > amount;
  const isWarning = percentage >= 80 && percentage < 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">${spent.toFixed(2)} spent</span>
        <span className="font-medium">${remaining.toFixed(2)} remaining</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={cn(
            "h-full transition-all duration-300",
            isExceeded && "bg-red-600",
            isWarning && !isExceeded && "bg-yellow-500",
            !isWarning && !isExceeded && "bg-green-600"
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span
          className={cn(
            "font-medium",
            isExceeded && "text-red-600",
            isWarning && !isExceeded && "text-yellow-600",
            !isWarning && !isExceeded && "text-green-600"
          )}
        >
          {percentage.toFixed(1)}% used
        </span>
        <span className="text-muted-foreground">
          Budget: ${amount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
