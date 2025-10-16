import { NextResponse } from "next/server";
import type { ApiResponse } from "@workspace/types";

export const runtime = "edge";

export const GET = (): NextResponse => {
  const response: ApiResponse<{ status: string }> = {
    success: true,
    data: { status: "OK" },
    message: "API is healthy",
  };

  return NextResponse.json(response, { status: 200 });
};
