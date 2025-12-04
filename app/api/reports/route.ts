import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = parseInt(
      searchParams.get("year") || new Date().getFullYear().toString()
    );
    const month = parseInt(
      searchParams.get("month") || (new Date().getMonth() + 1).toString()
    );

    // Calculate date range for selected month
    const selectedDate = new Date(year, month - 1, 1);
    const startDate = startOfMonth(selectedDate);
    const endDate = endOfMonth(selectedDate);

    // Get all transactions for the month
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: {
          select: {
            name: true,
            color: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Calculate summary
    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // Group expenses by category
    const categoryMap = new Map<string, { total: number; color?: string }>();

    transactions
      .filter((t) => t.type === "EXPENSE")
      .forEach((t) => {
        const existing = categoryMap.get(t.category.name);
        if (existing) {
          existing.total += Number(t.amount);
        } else {
          categoryMap.set(t.category.name, {
            total: Number(t.amount),
            color: t.category.color || undefined,
          });
        }
      });

    const spendingByCategory = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        total: data.total,
        percentage: totalExpenses > 0 ? (data.total / totalExpenses) * 100 : 0,
        color: data.color,
      }))
      .sort((a, b) => b.total - a.total);

    // Get monthly trends (last 6 months including current)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(selectedDate, i));
      const monthEnd = endOfMonth(subMonths(selectedDate, i));

      const monthTransactions = await prisma.transaction.findMany({
        where: {
          userId: session.user.id,
          date: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      const income = monthTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expenses = monthTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      monthlyData.push({
        month: format(monthStart, "MMM yyyy"),
        income,
        expenses,
        net: income - expenses,
      });
    }

    // Get top 10 expenses for the month
    const topTransactions = transactions
      .filter((t) => t.type === "EXPENSE")
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 10)
      .map((t) => ({
        id: t.id,
        description: t.description,
        amount: Number(t.amount),
        date: t.date.toISOString(),
        category: t.category.name,
      }));

    return NextResponse.json({
      summary: {
        totalIncome,
        totalExpenses,
        netSavings,
        transactionCount: transactions.length,
        savingsRate,
      },
      spendingByCategory,
      monthlyTrends: monthlyData,
      topTransactions,
    });
  } catch (error) {
    console.error("Report data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch report data" },
      { status: 500 }
    );
  }
}
