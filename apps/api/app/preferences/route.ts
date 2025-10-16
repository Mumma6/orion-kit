import {
  db,
  userPreferences,
  eq,
  updateUserPreferencesSchema,
} from "@workspace/database";
import type {
  PreferencesResponse,
  UpdatePreferencesResponse,
  ApiErrorResponse,
} from "@workspace/types";
import { withAxiom, logger } from "@workspace/observability";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@workspace/auth/server";
import { formatZodError } from "@/lib/validation";

export const GET = withAxiom(
  async (
    req
  ): Promise<NextResponse<PreferencesResponse | ApiErrorResponse>> => {
    const startTime = Date.now();

    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
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
  }
);

export const PUT = withAxiom(
  async (
    req
  ): Promise<NextResponse<UpdatePreferencesResponse | ApiErrorResponse>> => {
    const startTime = Date.now();

    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.id;

    const body = await req.json();

    const validation = updateUserPreferencesSchema.safeParse(body);

    if (!validation.success) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Validation failed",
        details: formatZodError(validation.error.issues),
      };
      return NextResponse.json(errorResponse, { status: 400 });
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
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Failed to update preferences",
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const duration = Date.now() - startTime;
    logger.info("User preferences updated", { userId, duration });

    const response: UpdatePreferencesResponse = {
      success: true,
      message: "Preferences updated successfully",
      data: updatedPref,
    };

    return NextResponse.json(response);
  }
);
