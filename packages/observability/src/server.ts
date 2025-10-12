import axiomClient from "./axiom";
import { Logger, AxiomJSTransport } from "@axiomhq/logging";
import { createAxiomRouteHandler, nextJsFormatters } from "@axiomhq/nextjs";

const AXIOM_DATASET = process.env.NEXT_PUBLIC_AXIOM_DATASET || "orion-kit";

export const logger = new Logger({
  transports: [
    new AxiomJSTransport({
      axiom: axiomClient,
      dataset: AXIOM_DATASET,
    }),
  ],
  formatters: nextJsFormatters,
});

export const withAxiom = createAxiomRouteHandler(logger);
