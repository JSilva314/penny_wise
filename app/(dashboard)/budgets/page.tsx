export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Budgets</h1>
        <p className="text-muted-foreground">
          Set spending limits for different categories
        </p>
      </div>

      <div className="rounded-lg border bg-card p-12 text-center">
        <h3 className="text-lg font-semibold">No budgets yet</h3>
        <p className="mt-2 text-muted-foreground">
          Create your first budget to start managing your spending
        </p>
      </div>
    </div>
  );
}
