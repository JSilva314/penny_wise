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
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    // Default to current month if no dates provided
    const startDate = startDateParam
      ? new Date(startDateParam)
      : startOfMonth(new Date());
    const endDate = endDateParam
      ? new Date(endDateParam)
      : endOfMonth(new Date());

    // Get all transactions in date range
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
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netSavings = totalIncome - totalExpenses;

    // Group expenses by category
    const categoryMap = new Map<
      string,
      {
        name: string;
        amount: number;
        color: string | null;
        icon: string | null;
      }
    >();

    transactions
      .filter((t) => t.type === "EXPENSE")
      .forEach((t) => {
        const existing = categoryMap.get(t.category.id);
        if (existing) {
          existing.amount += Number(t.amount);
        } else {
          categoryMap.set(t.category.id, {
            name: t.category.name,
            amount: Number(t.amount),
            color: t.category.color,
            icon: t.category.icon,
          });
        }
      });

    const spendingByCategory = Array.from(categoryMap.entries())
      .map(([id, data]) => ({
        id,
        ...data,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Get monthly trends (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = endOfMonth(subMonths(new Date(), i));

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

    // Get active budgets with progress
    const budgets = await prisma.budget.findMany({
      where: {
        userId: session.user.id,
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    });

    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        const categoryIds = budget.categories.map((c) => c.id);

        const budgetTransactions = await prisma.transaction.findMany({
          where: {
            userId: session.user!.id,
            categoryId: { in: categoryIds },
            type: "EXPENSE",
            date: {
              gte: budget.startDate,
              lte: budget.endDate,
            },
          },
        });

        const spent = budgetTransactions.reduce(
          (sum, t) => sum + Number(t.amount),
          0
        );

        const percentage = (spent / Number(budget.amount)) * 100;

        return {
          id: budget.id,
          name: budget.name,
          amount: Number(budget.amount),
          spent,
          remaining: Number(budget.amount) - spent,
          percentage: Math.min(percentage, 100),
          status: spent > Number(budget.amount) ? "exceeded" : "active",
        };
      })
    );

    // Recent transactions (last 10)
    const recentTransactions = transactions.slice(0, 10).map((t) => ({
      id: t.id,
      amount: Number(t.amount),
      type: t.type,
      date: t.date,
      description: t.description,
      category: t.category,
    }));

    // Calculate insights
    const averageDailySpending =
      totalExpenses /
      Math.max(
        1,
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
    const topCategory = spendingByCategory[0];
    const budgetsAtRisk = budgetsWithProgress.filter(
      (b) => b.percentage >= 80
    ).length;

    return NextResponse.json({
      summary: {
        totalIncome,
        totalExpenses,
        netSavings,
        transactionCount: transactions.length,
      },
      spendingByCategory,
      monthlyTrends: monthlyData,
      budgets: budgetsWithProgress,
      recentTransactions,
      insights: {
        averageDailySpending,
        topCategory: topCategory?.name || "None",
        topCategoryAmount: topCategory?.amount || 0,
        budgetsAtRisk,
      },
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
