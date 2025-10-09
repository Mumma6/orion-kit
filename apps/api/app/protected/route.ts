import { auth, currentUser } from "@workspace/auth/server";
import { NextResponse } from "next/server";

/**
 * GET /protected
 * Example of a protected API route that requires authentication
 */
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized - Please sign in" },
      { status: 401 }
    );
  }

  const user = await currentUser();

  return NextResponse.json({
    message: "This is a protected route",
    user: {
      id: user?.id,
      email: user?.emailAddresses[0]?.emailAddress,
      name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    },
  });
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized - Please sign in" },
      { status: 401 }
    );
  }

  const body = await request.json();

  return NextResponse.json({
    message: "Data received successfully",
    userId,
    data: body,
  });
}
