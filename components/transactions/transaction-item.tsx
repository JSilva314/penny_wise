"use client";

import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Transaction = {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: Date | string;
  description: string | null;
  category: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
  };
};

type TransactionItemProps = {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
};

export function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const isIncome = transaction.type === "INCOME";
  const date =
    typeof transaction.date === "string"
      ? new Date(transaction.date)
      : transaction.date;

  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
      <div className="flex items-center gap-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
          style={{
            backgroundColor: transaction.category.color
              ? `${transaction.category.color}20`
              : undefined,
          }}
        >
          {transaction.category.icon || "📁"}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{transaction.category.name}</p>
            {transaction.description && (
              <span className="text-sm text-muted-foreground">
                • {transaction.description}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {format(date, "MMM dd, yyyy")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p
          className={cn(
            "text-lg font-semibold",
            isIncome ? "text-green-600" : "text-red-600"
          )}
        >
          {isIncome ? "+" : "-"}${Number(transaction.amount).toFixed(2)}
        </p>

        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(transaction)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(transaction.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
