import { NextResponse } from "next/server";
import { db } from "@workspace/database";
import { users, eq } from "@workspace/database";

// @ts-ignore
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  if (!email || !password || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const exists = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (exists[0]) {
    return NextResponse.json({ error: "User exists" }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(users)
    .values({ email, name, password: hash, id: crypto.randomUUID() })

    .returning();

  return NextResponse.json({ success: true });
}
