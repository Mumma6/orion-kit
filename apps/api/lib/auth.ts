import { jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { db } from "@workspace/database";
import { users, eq } from "@workspace/database";

const getSecret = () => {
  const secret = process.env.AUTH_JWT_SECRET || "123";
  if (!secret) throw new Error("AUTH_JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
};

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified?: boolean;
}

export async function verifyToken(req: NextRequest): Promise<string | null> {
  // Try to get token from Authorization header first
  const authHeader = req.headers.get("authorization");
  let token = authHeader?.replace("Bearer ", "");

  // Fallback to cookie if no Authorization header
  if (!token) {
    const cookieHeader = req.headers.get("cookie") || "";
    token = cookieHeader
      .split(";")
      .map((c: string) => c.trim())
      .find((c: string) => c.startsWith("auth="))
      ?.split("=")[1];
  }

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
      audience: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002",
    });

    return (payload.sub as string | undefined) || null;
  } catch {
    return null;
  }
}

export async function getUserId(req: NextRequest): Promise<string | null> {
  return verifyToken(req);
}

export async function getCurrentUser(
  req: NextRequest
): Promise<AuthUser | null> {
  const userId = await verifyToken(req);

  if (!userId) {
    return null;
  }

  try {
    const row = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = row[0];
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name || "",
      image: user.image,
      emailVerified: user.emailVerified ? true : undefined,
    };
  } catch {
    return null;
  }
}

// Alias for compatibility with existing code
export const getUserFromRequest = getCurrentUser;
