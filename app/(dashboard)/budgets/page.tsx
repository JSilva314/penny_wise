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
import { BudgetForm } from "@/components/forms/budget-form";
import { BudgetList } from "@/components/budgets/budget-list";
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
  startDate: Date | string;
  endDate: Date | string;
  spent: number;
  remaining: number;
  percentage: number;
  status: string;
  categories: Category[];
};

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>();
  const [stats, setStats] = useState({
    totalBudgeted: 0,
    totalSpent: 0,
    activeBudgets: 0,
    exceededBudgets: 0,
  });

  const fetchBudgets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/budgets");
      if (!response.ok) throw new Error("Failed to fetch budgets");

      const data = await response.json();
      setBudgets(data.budgets);

      // Calculate stats
      const totalBudgeted = data.budgets.reduce(
        (sum: number, b: Budget) => sum + b.amount,
        0
      );
      const totalSpent = data.budgets.reduce(
        (sum: number, b: Budget) => sum + b.spent,
        0
      );
      const activeBudgets = data.budgets.filter(
        (b: Budget) => b.status === "active"
      ).length;
      const exceededBudgets = data.budgets.filter(
        (b: Budget) => b.status === "exceeded"
      ).length;

      setStats({
        totalBudgeted,
        totalSpent,
        activeBudgets,
        exceededBudgets,
      });
    } catch (error) {
      toast.error("Failed to load budgets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleEdit = (budget: Budget) => {
    setEditingBudget({
      ...budget,
      startDate:
        typeof budget.startDate === "string"
          ? new Date(budget.startDate)
          : budget.startDate,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;

    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete budget");

      toast.success("Budget deleted!");
      fetchBudgets();
    } catch (error) {
      toast.error("Failed to delete budget");
    }
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingBudget(undefined);
    fetchBudgets();
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingBudget(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-muted-foreground">
            Set spending limits for different categories
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Budgeted</p>
          <p className="mt-2 text-2xl font-bold">
            ${stats.totalBudgeted.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="mt-2 text-2xl font-bold">
            ${stats.totalSpent.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active Budgets</p>
          <p className="mt-2 text-2xl font-bold">{stats.activeBudgets}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Exceeded Budgets</p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {stats.exceededBudgets}
          </p>
        </div>
      </div>

      <BudgetList
        budgets={budgets}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBudget ? "Edit Budget" : "Add Budget"}
            </DialogTitle>
          </DialogHeader>
          <BudgetForm
            budget={
              editingBudget
                ? {
                    ...editingBudget,
                    startDate:
                      typeof editingBudget.startDate === "string"
                        ? new Date(editingBudget.startDate)
                        : editingBudget.startDate,
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
