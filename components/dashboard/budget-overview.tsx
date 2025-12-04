import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

type Budget = {
  id: string;
  name: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: "GOOD" | "WARNING" | "EXCEEDED";
};

type BudgetOverviewProps = {
  budgets: Budget[];
};

function getStatusColor(status: Budget["status"]) {
  switch (status) {
    case "GOOD":
      return "bg-green-500";
    case "WARNING":
      return "bg-yellow-500";
    case "EXCEEDED":
      return "bg-red-500";
  }
}

export function BudgetOverview({ budgets }: BudgetOverviewProps) {
  if (budgets.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Active Budgets</h3>
          <Link
            href="/budgets"
            className="text-sm text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          No active budgets
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Active Budgets</h3>
        <Link href="/budgets" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {budgets.map((budget) => (
          <div key={budget.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{budget.name}</span>
                <span
                  className={`h-2 w-2 rounded-full ${getStatusColor(
                    budget.status
                  )}`}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
              </span>
            </div>
            <Progress value={Math.min(budget.percentage, 100)} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{budget.percentage.toFixed(0)}% used</span>
              <span
                className={
                  budget.remaining >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                ${Math.abs(budget.remaining).toFixed(2)}{" "}
                {budget.remaining >= 0 ? "remaining" : "over"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
