import { NextResponse } from "next/server";

// TODO: Implement single transaction API endpoints
// GET /api/transactions/[id] - Get a specific transaction
export async function GET() {
  return NextResponse.json({
    message: "Get transaction endpoint - coming soon",
  });
}

// PUT /api/transactions/[id] - Update a transaction
export async function PUT() {
  return NextResponse.json({
    message: "Update transaction endpoint - coming soon",
  });
}

// DELETE /api/transactions/[id] - Delete a transaction
export async function DELETE() {
  return NextResponse.json({
    message: "Delete transaction endpoint - coming soon",
  });
}
