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
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    count: 0,
  });

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/transactions?${params}`);

      if (!response.ok) throw new Error("Failed to fetch transactions");

      const data = await response.json();
      setTransactions(data.transactions);

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
        count: data.transactions.length,
      });
    } catch (error) {
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete transaction");

      toast.success("Transaction deleted!");
      fetchTransactions();
    } catch (error) {
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm
            transaction={editingTransaction}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
