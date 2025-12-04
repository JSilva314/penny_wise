import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateBudgetSchema } from "@/lib/validations/budget";
import { addMonths, addYears, startOfDay } from "date-fns";

// GET /api/budgets/[id] - Get a specific budget
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId: session.user.id,
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

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    // Calculate spent amount
    const categoryIds = budget.categories.map((c) => c.id);
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        categoryId: { in: categoryIds },
        type: "EXPENSE",
        date: {
          gte: budget.startDate,
          lte: budget.endDate,
        },
      },
    });

    const spent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const remaining = Number(budget.amount) - spent;
    const percentage = (spent / Number(budget.amount)) * 100;

    let status = "active";
    if (new Date() > budget.endDate) {
      status = "completed";
    } else if (spent > Number(budget.amount)) {
      status = "exceeded";
    }

    return NextResponse.json({
      budget: {
        ...budget,
        amount: Number(budget.amount),
        spent,
        remaining,
        percentage: Math.min(percentage, 100),
        status,
      },
    });
  } catch (error) {
    console.error("Budget fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget" },
      { status: 500 }
    );
  }
}

// PUT /api/budgets/[id] - Update a budget
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify budget exists and user owns it
    const existingBudget = await prisma.budget.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateBudgetSchema.parse(body);

    // If categories provided, verify they exist
    if (validatedData.categoryIds) {
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
    }

    // Calculate new end date if period or start date changed
    let endDate = existingBudget.endDate;
    const startDate = validatedData.startDate
      ? startOfDay(validatedData.startDate)
      : existingBudget.startDate;
    const period = validatedData.period || existingBudget.period;

    if (validatedData.startDate || validatedData.period) {
      switch (period) {
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
    }

    // Update budget
    const updateData: any = {
      ...(validatedData.name && { name: validatedData.name }),
      ...(validatedData.amount && { amount: validatedData.amount }),
      ...(validatedData.period && { period: validatedData.period }),
      ...(validatedData.startDate && { startDate }),
      endDate,
    };

    // Handle category updates
    if (validatedData.categoryIds) {
      updateData.categories = {
        set: validatedData.categoryIds.map((id) => ({ id })),
      };
    }

    const budget = await prisma.budget.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ budget });
  } catch (error) {
    console.error("Budget update error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}

// DELETE /api/budgets/[id] - Delete a budget
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify budget exists and user owns it
    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    await prisma.budget.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Budget deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}
