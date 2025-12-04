"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type CategorySpending = {
  category: string;
  total: number;
  color?: string;
};

type SpendingBarChartProps = {
  data: CategorySpending[];
};

export function SpendingBarChart({ data }: SpendingBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No spending data available
      </div>
    );
  }

  // Get top 10 categories for better visualization
  const topCategories = data.slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={topCategories}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="category"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={80}
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
        <Bar
          dataKey="total"
          fill="#64748b"
          radius={[4, 4, 0, 0]}
          name="Spending"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
