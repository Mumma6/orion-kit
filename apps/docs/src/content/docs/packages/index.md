---
title: Packages
---

Orion Kit is organized as a monorepo with shared packages.

## Available Packages

### [@workspace/auth](/packages/auth)

Authentication package powered by Clerk. Provides:

- Client components (`SignInButton`, `UserButton`, etc.)
- Server utilities (`auth()`, `currentUser()`)
- Middleware helpers

### [@workspace/database](/packages/database)

Database layer with Drizzle ORM and Neon. Includes:

- Type-safe queries
- Zod validation schemas
- Database client
- Migrations

### [@workspace/types](/packages/types)

Centralized TypeScript types. Exports:

- Database entity types
- API request/response types
- Zod schemas

### [@workspace/ui](/packages/ui)

Shared UI components based on shadcn/ui. Contains:

- Accessible components
- Tailwind-styled
- Theme support

## Using Packages

All packages are consumed via workspace dependencies:

```json
{
  "dependencies": {
    "@workspace/auth": "workspace:*",
    "@workspace/database": "workspace:*",
    "@workspace/types": "workspace:*",
    "@workspace/ui": "workspace:*"
  }
}
```

## Package Development

### Adding New Packages

1. Create directory in `packages/`
2. Add `package.json` with `name: "@workspace/package-name"`
3. Update `pnpm-workspace.yaml` (if needed)
4. Install in consuming apps

### Publishing

Packages are private and workspace-only. They are not published to npm.

## Learn More

Click on each package above to see detailed documentation.
