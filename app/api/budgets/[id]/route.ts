import { NextResponse } from "next/server";

// TODO: Implement single budget API endpoints
// GET /api/budgets/[id] - Get a specific budget
export async function GET() {
  return NextResponse.json({ message: "Get budget endpoint - coming soon" });
}

// PUT /api/budgets/[id] - Update a budget
export async function PUT() {
  return NextResponse.json({ message: "Update budget endpoint - coming soon" });
}

// DELETE /api/budgets/[id] - Delete a budget
export async function DELETE() {
  return NextResponse.json({ message: "Delete budget endpoint - coming soon" });
}
