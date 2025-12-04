"use client";

import { TransactionItem } from "./transaction-item";

type Transaction = {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  date: Date | string;
  description: string | null;
  category: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
  };
};

type TransactionListProps = {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
};

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
  isLoading,
}: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No transactions found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first transaction to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
