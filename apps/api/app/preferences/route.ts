import { auth } from "@workspace/auth/server";
import {
  db,
  userPreferences,
  eq,
  updateUserPreferencesSchema,
} from "@workspace/database";
import { withAxiom, logger } from "@workspace/observability";
import { NextResponse } from "next/server";
import { validationErrorResponse } from "@/lib/validation";

export const GET = withAxiom(async () => {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn("Unauthorized access to GET /preferences");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const preferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.clerkUserId, userId))
      .limit(1);

    const userPref = preferences[0];

    if (!userPref) {
      const [newPref] = await db
        .insert(userPreferences)
        .values({ clerkUserId: userId })
        .returning();

      const duration = Date.now() - startTime;
      logger.info("User preferences created", { userId, duration });

      return NextResponse.json({
        success: true,
        data: newPref,
      });
    }

    const duration = Date.now() - startTime;
    logger.info("User preferences fetched", { userId, duration });

    return NextResponse.json({
      success: true,
      data: userPref,
    });
  } catch (error) {
    logger.error("Failed to fetch preferences", error as Error);
    throw error;
  }
});

export const PUT = withAxiom(async (req) => {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn("Unauthorized access to PUT /preferences");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const validation = updateUserPreferencesSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const validatedData = validation.data;

    const existing = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.clerkUserId, userId))
      .limit(1);

    const result = existing[0]
      ? await db
          .update(userPreferences)
          .set({
            ...validatedData,
            updatedAt: new Date(),
          })
          .where(eq(userPreferences.clerkUserId, userId))
          .returning()
      : await db
          .insert(userPreferences)
          .values({
            clerkUserId: userId,
            ...validatedData,
          })
          .returning();

    const updatedPref = result[0];

    if (!updatedPref) {
      throw new Error("Failed to update preferences");
    }

    const duration = Date.now() - startTime;
    logger.info("User preferences updated", { userId, duration });

    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
      data: updatedPref,
    });
  } catch (error) {
    logger.error("Failed to update preferences", error as Error);
    throw error;
  }
});
