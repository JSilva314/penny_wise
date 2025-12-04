"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type MonthlyData = {
  month: string;
  income: number;
  expenses: number;
  net: number;
};

type IncomeExpenseChartProps = {
  data: MonthlyData[];
};

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="month"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value: number) => `$${value.toFixed(2)}`}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#10b981"
          strokeWidth={2}
          name="Income"
          dot={{ fill: "#10b981" }}
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="#ef4444"
          strokeWidth={2}
          name="Expenses"
          dot={{ fill: "#ef4444" }}
        />
        <Line
          type="monotone"
          dataKey="net"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Net"
          dot={{ fill: "#3b82f6" }}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
