import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createTransactionSchema,
  transactionFilterSchema,
} from "@/lib/validations/transaction";

// GET /api/transactions - List all transactions with filters and pagination
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // Parse and validate query parameters
    const filters = transactionFilterSchema.parse({
      type: searchParams.get("type") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      search: searchParams.get("search") || undefined,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 20,
      offset: searchParams.get("offset")
        ? Number(searchParams.get("offset"))
        : 0,
    });

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    if (filters.search) {
      where.description = {
        contains: filters.search,
        mode: "insensitive",
      };
    }

    // Get total count for pagination
    const total = await prisma.transaction.count({ where });

    // Get transactions with category data
    const transactions = await prisma.transaction.findMany({
      where,
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
      take: filters.limit,
      skip: filters.offset,
    });

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        limit: filters.limit,
        offset: filters.offset,
        hasMore: filters.offset + filters.limit < total,
      },
    });
  } catch (error) {
    console.error("GET /api/transactions error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a transaction
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createTransactionSchema.parse(body);

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        amount: data.amount,
        type: data.type,
        categoryId: data.categoryId,
        date: data.date,
        description: data.description || null,
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
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("POST /api/transactions error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid transaction data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
