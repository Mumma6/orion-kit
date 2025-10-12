"use client";
import axiomClient from "./axiom";
import { Logger, AxiomJSTransport } from "@axiomhq/logging";
import { createUseLogger, createWebVitalsComponent } from "@axiomhq/react";
import { nextJsFormatters } from "@axiomhq/nextjs/client";

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

const useLogger = createUseLogger(logger);
const WebVitals = createWebVitalsComponent(logger);

export { useLogger, WebVitals };
