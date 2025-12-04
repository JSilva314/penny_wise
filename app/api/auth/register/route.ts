// TODO: Implement user registration API endpoint
// POST /api/auth/register
// This will handle user sign-up
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Server-side validation schema (no confirmPassword needed)
const registerSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = registerSchema.parse(body);

    const { email, password, name } = parsedData;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // If it's a Zod validation error
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to register user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
