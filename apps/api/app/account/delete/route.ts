import { deleteAccount, getCurrentUser } from "@workspace/auth/server";
import { NextRequest, NextResponse } from "next/server";
import type { DeleteAccountResponse, ApiErrorResponse } from "@workspace/types";

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Unauthorized",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const deleted = await deleteAccount(user.id);

    if (!deleted) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Failed to delete account",
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: { deleted: true },
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: "Internal server error",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
