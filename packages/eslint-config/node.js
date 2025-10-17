import { config as baseConfig } from "./base.js";
import globals from "globals";

/**
 * ESLint configuration for Node.js packages
 * @type {import("eslint").Linter.Config}
 */
export const config = [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Node.js specific rules
      "no-console": "off", // Allow console in Node.js
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];
