import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "packages/**/__tests__/**/*.{test,spec}.{js,ts,tsx}",
      "apps/**/__tests__/**/*.{test,spec}.{js,ts,tsx}",
    ],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "**/*.config.{js,ts}",
        "**/*.d.ts",
        "**/dist/**",
        "**/.next/**",
      ],
    },
  },
});
