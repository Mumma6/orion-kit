import { auth } from "@workspace/auth/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Optional: check if user is authenticated
  const { userId } = await auth();

  const { searchParams } = new URL(request.url);
  const message = searchParams.get("message") || "Hello, World!";

  return NextResponse.json({
    message,
    authenticated: !!userId,
    userId: userId || null,
  });
}

export async function POST(request: Request) {
  // Optional: check if user is authenticated
  const { userId } = await auth();

  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    echo: body,
    authenticated: !!userId,
    userId: userId || null,
  });
}
