import { NextResponse } from "next/server";
import type { LogoutResponse } from "@workspace/types";

export async function POST() {
  const responseData: LogoutResponse = {
    success: true,
    data: { loggedOut: true },
    message: "Logged out successfully",
  };

  const response = NextResponse.json(responseData);

  // Clear the auth cookie
  response.cookies.set("auth", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return response;
}
