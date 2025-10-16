import { db, users, eq } from "@workspace/database";
import { getCurrentUser } from "@workspace/auth/server";
import { UpdateProfileInputSchema } from "@workspace/types";
import type { UpdateProfileResponse, ApiErrorResponse } from "@workspace/types";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function PUT(req: NextRequest) {
  try {
    // Get the current user
    const user = await getCurrentUser(req);

    if (!user) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Unauthorized",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = UpdateProfileInputSchema.parse(body);

    // Update user profile
    const updatedUser = await db
      .update(users)
      .set({
        name: validatedData.name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        image: users.image,
        emailVerified: users.emailVerified,
      });

    if (updatedUser.length === 0) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "User not found",
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const userData = updatedUser[0];

    return userData
      ? NextResponse.json({
          success: true,
          data: {
            id: userData?.id,
            email: userData?.email,
            name: userData?.name || "",
            image: userData?.image || undefined,
            emailVerified: userData?.emailVerified || undefined,
          },
          message: "Profile updated successfully",
        })
      : NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Error updating profile:", error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: "Internal server error",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
