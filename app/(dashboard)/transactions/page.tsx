"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionForm } from "@/components/forms/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionStats } from "@/components/transactions/transaction-stats";
import { toast } from "sonner";

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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total: 0,
    hasMore: false,
  });
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    count: 0,
  });

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
      });
      const response = await fetch(`/api/transactions?${params}`);

      if (!response.ok) throw new Error("Failed to fetch transactions");

      const data = await response.json();
      setTransactions(data.transactions);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination.total,
        hasMore: data.pagination.hasMore,
      }));

      // Calculate stats
      const income = data.transactions
        .filter((t: Transaction) => t.type === "INCOME")
        .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);

      const expenses = data.transactions
        .filter((t: Transaction) => t.type === "EXPENSE")
        .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);

      setStats({
        totalIncome: income,
        totalExpenses: expenses,
        count: data.pagination.total,
      });
    } catch (error) {
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters, pagination.offset]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction({
      ...transaction,
      date:
        typeof transaction.date === "string"
          ? new Date(transaction.date)
          : transaction.date,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    // Optimistic update - remove from UI immediately
    const originalTransactions = [...transactions];
    setTransactions(transactions.filter((t) => t.id !== id));

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete transaction");

      toast.success("Transaction deleted!");
      fetchTransactions(); // Refresh to get accurate stats
    } catch (error) {
      // Revert on error
      setTransactions(originalTransactions);
      toast.error("Failed to delete transaction");
    }
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingTransaction(undefined);
    fetchTransactions();
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingTransaction(undefined);
  };

  const handleNextPage = () => {
    setPagination((prev) => ({
      ...prev,
      offset: prev.offset + prev.limit,
    }));
  };

  const handlePrevPage = () => {
    setPagination((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            Track all your income and expenses
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <TransactionStats
        totalIncome={stats.totalIncome}
        totalExpenses={stats.totalExpenses}
        transactionCount={stats.count}
      />

      <TransactionFilters onFilterChange={setFilters} />

      <TransactionList
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Pagination Controls */}
      {transactions.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Showing {pagination.offset + 1} -{" "}
            {Math.min(pagination.offset + pagination.limit, pagination.total)}{" "}
            of {pagination.total} transactions
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={pagination.offset === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!pagination.hasMore}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm
            transaction={
              editingTransaction
                ? {
                    ...editingTransaction,
                    date:
                      typeof editingTransaction.date === "string"
                        ? new Date(editingTransaction.date)
                        : editingTransaction.date,
                  }
                : undefined
            }
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
