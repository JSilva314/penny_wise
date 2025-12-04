import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, format } from "date-fns";

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
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Generate CSV
    const csvRows = [
      ["Date", "Description", "Category", "Type", "Amount"],
      ...transactions.map((t) => [
        format(new Date(t.date), "yyyy-MM-dd"),
        t.description,
        t.category.name,
        t.type,
        t.amount.toString(),
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="transactions-${year}-${month}.csv"`,
      },
    });
  } catch (error) {
    console.error("CSV export error:", error);
    return NextResponse.json(
      { error: "Failed to export CSV" },
      { status: 500 }
    );
  }
}
