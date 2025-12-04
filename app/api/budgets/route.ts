import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createBudgetSchema,
  budgetFilterSchema,
} from "@/lib/validations/budget";
import { addMonths, addYears, startOfDay } from "date-fns";

// GET /api/budgets - List all budgets with filtering
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      period: searchParams.get("period") || undefined,
      status: searchParams.get("status") || undefined,
      search: searchParams.get("search") || undefined,
    };

    const validatedFilters = budgetFilterSchema.parse(filters);

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (validatedFilters.period) {
      where.period = validatedFilters.period;
    }

    if (validatedFilters.search) {
      where.name = {
        contains: validatedFilters.search,
        mode: "insensitive",
      };
    }

    // Get budgets with categories
    const budgets = await prisma.budget.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate spent amounts for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const categoryIds = budget.categories.map((c) => c.id);

        // Calculate end date based on period
        let endDate = new Date(budget.endDate);

        // Get transactions in this budget's date range and categories
        const transactions = await prisma.transaction.findMany({
          where: {
            userId: session.user!.id,
            categoryId: { in: categoryIds },
            type: "EXPENSE",
            date: {
              gte: budget.startDate,
              lte: endDate,
            },
          },
        });

        const spent = transactions.reduce(
          (sum, t) => sum + Number(t.amount),
          0
        );
        const remaining = Number(budget.amount) - spent;
        const percentage = (spent / Number(budget.amount)) * 100;

        // Determine status
        let status = "active";
        if (new Date() > endDate) {
          status = "completed";
        } else if (spent > Number(budget.amount)) {
          status = "exceeded";
        }

        return {
          ...budget,
          amount: Number(budget.amount),
          spent,
          remaining,
          percentage: Math.min(percentage, 100),
          status,
        };
      })
    );

    // Apply status filter if provided
    const filteredBudgets = validatedFilters.status
      ? budgetsWithSpent.filter((b) => b.status === validatedFilters.status)
      : budgetsWithSpent;

    return NextResponse.json({ budgets: filteredBudgets });
  } catch (error) {
    console.error("Budget list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

// POST /api/budgets - Create a new budget
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createBudgetSchema.parse(body);

    // Verify all categories exist
    const categories = await prisma.category.findMany({
      where: {
        id: { in: validatedData.categoryIds },
      },
    });

    if (categories.length !== validatedData.categoryIds.length) {
      return NextResponse.json(
        { error: "One or more categories not found" },
        { status: 400 }
      );
    }

    // Calculate end date based on period
    let endDate: Date;
    const startDate = startOfDay(validatedData.startDate);

    switch (validatedData.period) {
      case "MONTHLY":
        endDate = addMonths(startDate, 1);
        break;
      case "QUARTERLY":
        endDate = addMonths(startDate, 3);
        break;
      case "YEARLY":
        endDate = addYears(startDate, 1);
        break;
    }

    // Create budget with category connections
    const budget = await prisma.budget.create({
      data: {
        name: validatedData.name,
        amount: validatedData.amount,
        period: validatedData.period,
        startDate,
        endDate,
        userId: session.user.id,
        categories: {
          connect: validatedData.categoryIds.map((id) => ({ id })),
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

    return NextResponse.json({ budget }, { status: 201 });
  } catch (error) {
    console.error("Budget creation error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}
