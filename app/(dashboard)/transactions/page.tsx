export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          Track all your income and expenses
        </p>
      </div>

      <div className="rounded-lg border bg-card p-12 text-center">
        <h3 className="text-lg font-semibold">No transactions yet</h3>
        <p className="mt-2 text-muted-foreground">
          Start adding transactions to see them here
        </p>
      </div>
    </div>
  );
}
