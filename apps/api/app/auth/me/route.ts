import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@workspace/auth/server";
import type { AuthResponse } from "@workspace/types";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);

  const response: AuthResponse = {
    success: true,
    data: user,
  };

  return NextResponse.json(response);
}
