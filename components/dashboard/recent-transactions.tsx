import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

type Transaction = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
  date: string;
  category: {
    name: string;
    color?: string;
  };
};

type RecentTransactionsProps = {
  transactions: Transaction[];
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="text-center py-8 text-muted-foreground">
          No transactions yet
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  transaction.type === "INCOME"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {transaction.type === "INCOME" ? (
                  <ArrowUpIcon className="h-5 w-5" />
                ) : (
                  <ArrowDownIcon className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-medium">{transaction.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: transaction.category.color || "#64748b",
                    }}
                  />
                  <span>{transaction.category.name}</span>
                  <span>•</span>
                  <span>
                    {format(new Date(transaction.date), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
            <p
              className={`font-semibold ${
                transaction.type === "INCOME"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {transaction.type === "INCOME" ? "+" : "-"}$
              {transaction.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
