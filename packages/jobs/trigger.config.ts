import type { TriggerConfig } from "@trigger.dev/sdk/v3";
import "dotenv/config";

if (!process.env.TRIGGER_PROJECT) {
  throw new Error("TRIGGER_PROJECT is not set");
}

export const config: TriggerConfig = {
  // Replace <your-project-ref> with your project id: https://trigger.dev/docs/trigger-config
  project: process.env.TRIGGER_PROJECT,
  logLevel: "log",
  maxDuration: 5000,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
};
