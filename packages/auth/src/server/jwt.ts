import { SignJWT, jwtVerify } from "jose";
import type { AuthUser } from "@workspace/types";

const getSecret = () => {
  const secret = process.env.AUTH_JWT_SECRET || "123";
  if (!secret) throw new Error("AUTH_JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
};

export async function createToken(user: AuthUser): Promise<string> {
  return await new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001")
    .setAudience(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002")
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<string | null> {
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
