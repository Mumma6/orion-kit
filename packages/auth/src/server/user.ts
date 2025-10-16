import { db, users, eq, tasks, userPreferences } from "@workspace/database";
import type { AuthUser } from "@workspace/types";
import { verifyToken } from "./jwt";

export async function getUserId(req: Request): Promise<string | null> {
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

  return verifyToken(token);
}

export async function getCurrentUser(req: Request): Promise<AuthUser | null> {
  const userId = await getUserId(req);

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
      image: user.image || undefined,
      emailVerified: user.emailVerified || undefined,
    };
  } catch {
    return null;
  }
}

export async function deleteAccount(userId: string): Promise<boolean> {
  try {
    // Delete in order: tasks -> preferences -> user (to respect foreign key constraints)
    await db.delete(tasks).where(eq(tasks.userId, userId));
    await db.delete(userPreferences).where(eq(userPreferences.userId, userId));
    const deletedUser = await db.delete(users).where(eq(users.id, userId));

    // Check if user was actually deleted
    return deletedUser !== undefined;
  } catch (error) {
    console.error("Error deleting account:", error);
    return false;
  }
}
