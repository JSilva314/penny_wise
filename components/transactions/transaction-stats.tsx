"use client";

type TransactionStatsProps = {
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
};

export function TransactionStats({
  totalIncome,
  totalExpenses,
  transactionCount,
}: TransactionStatsProps) {
  const netAmount = totalIncome - totalExpenses;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm font-medium text-muted-foreground">
          Total Income
        </p>
        <p className="mt-2 text-2xl font-bold text-green-600">
          ${totalIncome.toFixed(2)}
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm font-medium text-muted-foreground">
          Total Expenses
        </p>
        <p className="mt-2 text-2xl font-bold text-red-600">
          ${totalExpenses.toFixed(2)}
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm font-medium text-muted-foreground">Net Amount</p>
        <p
          className={`mt-2 text-2xl font-bold ${
            netAmount >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {netAmount >= 0 ? "+" : "-"}${Math.abs(netAmount).toFixed(2)}
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm font-medium text-muted-foreground">
          Transactions
        </p>
        <p className="mt-2 text-2xl font-bold">{transactionCount}</p>
      </div>
    </div>
  );
}
