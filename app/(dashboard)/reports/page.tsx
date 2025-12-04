"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart";
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart";
import { SpendingBarChart } from "@/components/dashboard/spending-bar-chart";
import { DownloadIcon, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ReportData = {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    transactionCount: number;
    savingsRate: number;
  };
  spendingByCategory: Array<{
    category: string;
    total: number;
    percentage: number;
    color?: string;
  }>;
  monthlyTrends: Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }>;
  topTransactions: Array<{
    id: string;
    description: string;
    amount: number;
    date: string;
    category: string;
  }>;
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );

  const years = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  useEffect(() => {
    async function fetchReportData() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/reports?year=${selectedYear}&month=${selectedMonth}`
        );
        if (!response.ok) throw new Error("Failed to fetch report");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReportData();
  }, [selectedYear, selectedMonth]);

  async function exportToCSV() {
    try {
      const response = await fetch(
        `/api/reports/export?year=${selectedYear}&month=${selectedMonth}`
      );
      if (!response.ok) throw new Error("Failed to export");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${selectedYear}-${selectedMonth}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Monthly Report</h1>
        </div>
        <Card className="p-6 h-64 animate-pulse bg-muted" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Monthly Report</h1>
        <Card className="p-6">
          <p className="text-muted-foreground">Failed to load report data</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Monthly Report</h1>
          <p className="text-muted-foreground">
            Detailed financial analysis for{" "}
            {months.find((m) => m.value === selectedMonth)?.label}{" "}
            {selectedYear}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={exportToCSV} variant="outline">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Income</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            ${data.summary.totalIncome.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            ${data.summary.totalExpenses.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Net Savings</p>
          <p
            className={`text-2xl font-bold mt-2 ${
              data.summary.netSavings >= 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            ${data.summary.netSavings.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Savings Rate</p>
          <p
            className={`text-2xl font-bold mt-2 ${
              data.summary.savingsRate >= 20
                ? "text-green-600"
                : "text-yellow-600"
            }`}
          >
            {data.summary.savingsRate.toFixed(1)}%
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <CategoryPieChart data={data.spendingByCategory} />
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Monthly Trends (Last 6 Months)
          </h3>
          <IncomeExpenseChart data={data.monthlyTrends} />
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        <SpendingBarChart data={data.spendingByCategory} />
      </Card>

      {/* Top Transactions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Expenses This Month</h3>
        {data.topTransactions.length > 0 ? (
          <div className="space-y-3">
            {data.topTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category} •{" "}
                    {format(new Date(transaction.date), "MMM d, yyyy")}
                  </p>
                </div>
                <p className="font-semibold text-red-600">
                  ${transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No transactions this month
          </p>
        )}
      </Card>

      {/* Transaction Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Transactions:</span>
            <span className="font-medium">{data.summary.transactionCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Average Transaction:</span>
            <span className="font-medium">
              $
              {data.summary.transactionCount > 0
                ? (
                    data.summary.totalExpenses / data.summary.transactionCount
                  ).toFixed(2)
                : "0.00"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Top Category:</span>
            <span className="font-medium">
              {data.spendingByCategory[0]?.category || "N/A"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
