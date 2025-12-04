import { NextResponse } from "next/server";

// TODO: Implement transactions API endpoints
// GET /api/transactions - List all transactions
export async function GET() {
  return NextResponse.json({
    message: "Transactions list endpoint - coming soon",
  });
}

// POST /api/transactions - Create a transaction
export async function POST() {
  return NextResponse.json({
    message: "Create transaction endpoint - coming soon",
  });
}
