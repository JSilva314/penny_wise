"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

type CategoryData = {
  category: string;
  total: number;
  color?: string;
};

type CategoryPieChartProps = {
  data: CategoryData[];
};

const DEFAULT_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B9D",
];

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No spending data available
      </div>
    );
  }

  // Take top 5 categories
  const topCategories = data.slice(0, 5);
  const chartData = topCategories.map((cat) => ({
    name: cat.category,
    value: cat.total,
    color: cat.color || undefined,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${((percent || 0) * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
              }
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `$${value.toFixed(2)}`}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
