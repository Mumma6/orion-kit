/**
 * Validation Utilities
 * Functional helpers for Zod validation and error handling
 */

import { NextResponse } from "next/server";

/**
 * Generic Zod issue interface
 * Works with both standard Zod and drizzle-zod
 * Uses PropertyKey to support both standard Zod and drizzle-zod path types
 */
interface ValidationIssue {
  readonly message: string;
  readonly path: ReadonlyArray<PropertyKey>;
}

/**
 * Format Zod errors into a readable string
 * @example "Title is required - title, Description too long - description"
 */
export const formatZodError = (errors: readonly ValidationIssue[]): string =>
  errors.map((err) => `${err.message} - ${err.path.join(".")}`).join(", ");

/**
 * Format Zod errors into structured API response
 */
export const formatZodErrorResponse = (errors: readonly ValidationIssue[]) => ({
  success: false,
  error: "Validation failed",
  issues: errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  })),
});

/**
 * Create a validation error NextResponse (400)
 * Use with Zod's safeParse directly
 *
 * Works with both standard Zod and drizzle-zod schemas
 *
 * @example
 * const result = schema.safeParse(data);
 * if (!result.success) return validationErrorResponse(result.error.issues);
 * const validData = result.data;
 */
export const validationErrorResponse = (errors: readonly ValidationIssue[]) =>
  NextResponse.json(formatZodErrorResponse(errors), { status: 400 });
