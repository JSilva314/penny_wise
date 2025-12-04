"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { DateRangeSelector } from "@/components/dashboard/date-range-selector";
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart";
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart";
import { SpendingBarChart } from "@/components/dashboard/spending-bar-chart";
import { BudgetOverview } from "@/components/dashboard/budget-overview";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import {
  DollarSignIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  WalletIcon,
} from "lucide-react";
import { startOfMonth, endOfMonth } from "date-fns";

type DashboardData = {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    transactionCount: number;
  };
  spendingByCategory: Array<{
    category: string;
    total: number;
    color?: string;
  }>;
  monthlyTrends: Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }>;
  budgets: Array<{
    id: string;
    name: string;
    amount: number;
    spent: number;
    remaining: number;
    percentage: number;
    status: "GOOD" | "WARNING" | "EXCEEDED";
  }>;
  recentTransactions: Array<{
    id: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
    description: string;
    date: string;
    category: {
      name: string;
      color?: string;
    };
  }>;
  insights: {
    averageDailySpending: number;
    topCategory: string | null;
    budgetsAtRisk: number;
  };
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  });

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
        });
        const response = await fetch(`/api/dashboard?${params}`);
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Loading your financial overview...
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 h-32 animate-pulse bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Card className="p-6">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to PennyWise! Here's your financial overview.
          </p>
        </div>
        <DateRangeSelector onRangeChange={setDateRange} />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          title="Total Income"
          value={`$${data.summary.totalIncome.toFixed(2)}`}
          icon={TrendingUpIcon}
          className="border-l-4 border-l-green-500"
        />
        <SummaryCard
          title="Total Expenses"
          value={`$${data.summary.totalExpenses.toFixed(2)}`}
          icon={TrendingDownIcon}
          className="border-l-4 border-l-red-500"
        />
        <SummaryCard
          title="Net Savings"
          value={`$${data.summary.netSavings.toFixed(2)}`}
          icon={DollarSignIcon}
          className="border-l-4 border-l-blue-500"
        />
        <SummaryCard
          title="Transactions"
          value={data.summary.transactionCount}
          icon={WalletIcon}
          className="border-l-4 border-l-purple-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
          <IncomeExpenseChart data={data.monthlyTrends} />
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <CategoryPieChart data={data.spendingByCategory} />
        </Card>
      </div>

      {/* Spending Bar Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Top Categories by Spending
        </h3>
        <SpendingBarChart data={data.spendingByCategory} />
      </Card>

      {/* Insights & Quick Stats */}
      {data.insights && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">
              Average Daily Spending
            </p>
            <p className="text-2xl font-bold mt-2">
              ${data.insights.averageDailySpending.toFixed(2)}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Top Category</p>
            <p className="text-2xl font-bold mt-2">
              {data.insights.topCategory || "N/A"}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Budgets at Risk</p>
            <p className="text-2xl font-bold mt-2 text-yellow-600">
              {data.insights.budgetsAtRisk}
            </p>
          </Card>
        </div>
      )}

      {/* Budget Overview & Recent Transactions */}
      <div className="grid gap-4 md:grid-cols-2">
        <BudgetOverview budgets={data.budgets} />
        <RecentTransactions transactions={data.recentTransactions} />
      </div>
    </div>
  );
}
