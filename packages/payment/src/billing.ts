import { z } from "zod";

export const createCheckoutSessionInputSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export type CreateCheckoutSessionInput = z.infer<
  typeof createCheckoutSessionInputSchema
>;
