import { toast } from "sonner";
import { ZodError } from "zod";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "An unexpected error occurred";
}

function formatZodError(error: ZodError): string {
  const firstError = error.errors[0];
  if (!firstError) return "Validation failed";

  const field = firstError.path.join(".");
  return field ? `${field}: ${firstError.message}` : firstError.message;
}

export function showErrorToast(error: unknown, title = "Error") {
  let message: string;

  if (error instanceof ZodError) {
    message = formatZodError(error);
  } else {
    message = getErrorMessage(error);
  }

  toast.error(title, {
    description: message,
  });
}

export function showSuccessToast(message: string, description?: string) {
  toast.success(message, {
    description,
  });
}
