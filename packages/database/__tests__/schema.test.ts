import { describe, it, expect } from "vitest";
import {
  createTaskInputSchema,
  updateTaskInputSchema,
  insertUserPreferenceSchema,
} from "../src/schema";

describe("Database Schemas", () => {
  describe("createTaskInputSchema", () => {
    it("should validate valid task input", () => {
      const validInput = {
        title: "Test Task",
        description: "Test Description",
        status: "todo" as const,
      };

      const result = createTaskInputSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should reject empty title", () => {
      const invalidInput = {
        title: "",
        status: "todo" as const,
      };

      const result = createTaskInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject title longer than 255 characters", () => {
      const invalidInput = {
        title: "a".repeat(256),
        status: "todo" as const,
      };

      const result = createTaskInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject description longer than 1000 characters", () => {
      const invalidInput = {
        title: "Test Task",
        description: "a".repeat(1001),
        status: "todo" as const,
      };

      const result = createTaskInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should accept valid status values", () => {
      const statuses = ["todo", "in-progress", "completed", "cancelled"];

      statuses.forEach((status) => {
        const input = {
          title: "Test Task",
          status,
        };

        const result = createTaskInputSchema.safeParse(input);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("updateTaskInputSchema", () => {
    it("should allow partial updates", () => {
      const partialInput = {
        title: "Updated Title",
      };

      const result = updateTaskInputSchema.safeParse(partialInput);
      expect(result.success).toBe(true);
    });

    it("should allow empty object", () => {
      const result = updateTaskInputSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe("insertUserPreferenceSchema", () => {
    it("should validate valid user preferences", () => {
      const validInput = {
        userId: "user_123",
        theme: "dark",
        language: "en",
      };

      const result = insertUserPreferenceSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should require userId", () => {
      const invalidInput = {
        theme: "dark",
      };

      const result = insertUserPreferenceSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});
