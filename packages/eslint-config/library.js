import { config as baseConfig } from "./base.js";

/**
 * ESLint configuration for library packages (non-React)
 * @type {import("eslint").Linter.Config}
 */
export const config = [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Library-specific rules
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];
