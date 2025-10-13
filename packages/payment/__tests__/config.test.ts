import { describe, it, expect } from "vitest";
import {
  getPlanById,
  getPlanByPriceId,
  isFreePlan,
  canUpgrade,
  PLANS,
} from "../src/config";

describe("Payment Config Utilities", () => {
  describe("getPlanById", () => {
    it("should return correct plan for valid id", () => {
      const plan = getPlanById("pro");
      expect(plan).toBeDefined();
      expect(plan?.id).toBe("pro");
      expect(plan?.name).toBe("Pro");
      expect(plan?.price).toBe(19);
    });

    it("should return undefined for invalid id", () => {
      const plan = getPlanById("invalid");
      expect(plan).toBeUndefined();
    });

    it("should return free plan", () => {
      const plan = getPlanById("free");
      expect(plan).toBeDefined();
      expect(plan?.price).toBe(0);
      expect(plan?.maxTasks).toBe(10);
    });
  });

  describe("getPlanByPriceId", () => {
    it("should return plan for matching priceId", () => {
      const proPlan = PLANS.find((p) => p.id === "pro");
      if (proPlan?.priceId) {
        const plan = getPlanByPriceId(proPlan.priceId);
        expect(plan).toBeDefined();
        expect(plan?.id).toBe("pro");
      }
    });

    it("should return undefined for non-existent priceId", () => {
      const plan = getPlanByPriceId("price_nonexistent");
      expect(plan).toBeUndefined();
    });
  });

  describe("isFreePlan", () => {
    it("should return true for free plan", () => {
      expect(isFreePlan("free")).toBe(true);
    });

    it("should return false for paid plans", () => {
      expect(isFreePlan("pro")).toBe(false);
      expect(isFreePlan("enterprise")).toBe(false);
    });

    it("should return false for invalid plan id", () => {
      expect(isFreePlan("invalid")).toBe(false);
    });
  });

  describe("canUpgrade", () => {
    it("should allow upgrade from free to pro", () => {
      expect(canUpgrade("free", "pro")).toBe(true);
    });

    it("should allow upgrade from free to enterprise", () => {
      expect(canUpgrade("free", "enterprise")).toBe(true);
    });

    it("should allow upgrade from pro to enterprise", () => {
      expect(canUpgrade("pro", "enterprise")).toBe(true);
    });

    it("should not allow downgrade from pro to free", () => {
      expect(canUpgrade("pro", "free")).toBe(false);
    });

    it("should not allow downgrade from enterprise to pro", () => {
      expect(canUpgrade("enterprise", "pro")).toBe(false);
    });

    it("should not allow same plan upgrade", () => {
      expect(canUpgrade("pro", "pro")).toBe(false);
    });
  });
});
