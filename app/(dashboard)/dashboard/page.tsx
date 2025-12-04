export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to PennyWise! Your personal budgeting companion.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Balance
          </h3>
          <p className="mt-2 text-3xl font-bold">$0.00</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            This Month's Income
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">$0.00</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            This Month's Expenses
          </h3>
          <p className="mt-2 text-3xl font-bold text-red-600">$0.00</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold">Getting Started</h2>
        <p className="mt-2 text-muted-foreground">
          Start tracking your finances by adding your first transaction or
          setting up a budget.
        </p>
      </div>
    </div>
  );
}
