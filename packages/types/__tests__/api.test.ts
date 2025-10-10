import { describe, it, expect } from "vitest";
import { isSuccessResponse, isErrorResponse } from "../src/api";
import type { ApiSuccessResponse, ApiErrorResponse } from "../src/api";

describe("API Type Guards", () => {
  describe("isSuccessResponse", () => {
    it("should return true for success response", () => {
      const response: ApiSuccessResponse<string> = {
        success: true,
        data: "test",
      };

      expect(isSuccessResponse(response)).toBe(true);
    });

    it("should return false for error response", () => {
      const response: ApiErrorResponse = {
        success: false,
        error: "Test error",
      };

      expect(isSuccessResponse(response)).toBe(false);
    });

    it("should narrow type correctly", () => {
      const response: ApiSuccessResponse<string> | ApiErrorResponse = {
        success: true,
        data: "test",
      };

      if (isSuccessResponse(response)) {
        // Type should be narrowed to ApiSuccessResponse
        expect(response.data).toBe("test");
      }
    });
  });

  describe("isErrorResponse", () => {
    it("should return true for error response", () => {
      const response: ApiErrorResponse = {
        success: false,
        error: "Test error",
      };

      expect(isErrorResponse(response)).toBe(true);
    });

    it("should return false for success response", () => {
      const response: ApiSuccessResponse<string> = {
        success: true,
        data: "test",
      };

      expect(isErrorResponse(response)).toBe(false);
    });

    it("should narrow type correctly", () => {
      const response: ApiSuccessResponse<string> | ApiErrorResponse = {
        success: false,
        error: "Test error",
        code: "TEST_ERROR",
      };

      if (isErrorResponse(response)) {
        // Type should be narrowed to ApiErrorResponse
        expect(response.error).toBe("Test error");
        expect(response.code).toBe("TEST_ERROR");
      }
    });
  });
});
