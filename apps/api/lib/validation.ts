import { NextResponse } from "next/server";

interface ValidationIssue {
  readonly message: string;
  readonly path: ReadonlyArray<PropertyKey>;
}

export const formatZodError = (errors: readonly ValidationIssue[]): string =>
  errors.map((err) => `${err.message} - ${err.path.join(".")}`).join(", ");

export const formatZodErrorResponse = (errors: readonly ValidationIssue[]) => ({
  success: false,
  error: "Validation failed",
  issues: errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  })),
});

export const validationErrorResponse = (errors: readonly ValidationIssue[]) =>
  NextResponse.json(formatZodErrorResponse(errors), { status: 400 });
