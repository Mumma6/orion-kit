import {
  db,
  userPreferences,
  eq,
  updateUserPreferencesSchema,
} from "@workspace/database";
import type {
  PreferencesResponse,
  UpdatePreferencesResponse,
} from "@workspace/types";
import { withAxiom, logger } from "@workspace/observability";
import { NextResponse } from "next/server";
import { validationErrorResponse } from "@/lib/validation";
import { getCurrentUser } from "@/lib/auth";

export const GET = withAxiom(async (req) => {
  const startTime = Date.now();

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    const preferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    const userPref = preferences[0];

    if (!userPref) {
      const [newPref] = await db
        .insert(userPreferences)
        .values({ userId: userId })
        .returning();

      if (!newPref) {
        return NextResponse.json(
          { success: false, error: "Failed to create user preferences" },
          { status: 500 }
        );
      }

      const duration = Date.now() - startTime;
      logger.info("User preferences created", { userId, duration });

      const response: PreferencesResponse = {
        success: true,
        data: newPref,
      };

      return NextResponse.json(response);
    }

    const duration = Date.now() - startTime;
    logger.info("User preferences fetched", { userId, duration });

    const response: PreferencesResponse = {
      success: true,
      data: userPref,
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error("Failed to fetch preferences", error as Error);
    throw error;
  }
});

export const PUT = withAxiom(async (req) => {
  const startTime = Date.now();

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    const body = await req.json();

    const validation = updateUserPreferencesSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const validatedData = validation.data;

    const existing = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    const result = existing[0]
      ? await db
          .update(userPreferences)
          .set({
            ...validatedData,
            updatedAt: new Date(),
          })
          .where(eq(userPreferences.userId, userId))
          .returning()
      : await db
          .insert(userPreferences)
          .values({
            userId: userId,
            ...validatedData,
          })
          .returning();

    const updatedPref = result[0];

    if (!updatedPref) {
      throw new Error("Failed to update preferences");
    }

    const duration = Date.now() - startTime;
    logger.info("User preferences updated", { userId, duration });

    const response: UpdatePreferencesResponse = {
      success: true,
      message: "Preferences updated successfully",
      data: updatedPref,
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error("Failed to update preferences", error as Error);
    throw error;
  }
});
