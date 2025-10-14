---
title: Documentation Site
description: Comprehensive documentation built with Astro and Starlight
---

The documentation site (`apps/docs`) provides comprehensive guides, API references, and tutorials for Orion Kit using Astro and Starlight.

**Purpose**: Documentation and guides for Orion Kit  
**Framework**: Astro with Starlight theme  
**Port**: `3004` (development)  
**Domain**: `docs.orion-kit.dev` (production)  
**Theme**: Starlight with Nova theme customization

## Structure

```
apps/docs/
├── src/
│   ├── content/
│   │   └── docs/
│   │       ├── apps/              # Application documentation
│   │       ├── architecture/      # System architecture guides
│   │       ├── guide/             # Step-by-step guides
│   │       ├── packages/          # Package documentation
│   │       ├── reference/         # Integration guides
│   │       ├── index.mdx          # Homepage
│   │       ├── introduction.md    # Getting started
│   │       └── quick-start.md     # Quick setup guide
│   ├── assets/                    # Images and static assets
│   └── content.config.ts          # Content configuration
├── public/
│   └── favicon.svg                # Site favicon
├── astro.config.mjs               # Astro configuration
├── package.json                   # Dependencies and scripts
└── tsconfig.json                  # TypeScript configuration
```

## Content Organization

### **Getting Started**

- **Introduction** - Overview of Orion Kit
- **Quick Start** - Fast setup guide
- **Accounts Setup** - Cloud provider configuration
- **Environment Variables** - Configuration guide

### **Architecture**

- **Overview** - System architecture and data flow
- **Type System** - How types flow from database to frontend

### **Guides**

- **Deployment** - Production deployment guide
- **Testing** - Unit and E2E testing
- **Forms** - React Hook Form integration
- **Error Handling** - Error management strategies
- **TanStack Query** - Data fetching patterns
- **Zod** - Validation and schemas
- **Stripe Payments** - Payment integration
- **E2E Testing** - Playwright testing

### **Packages**

- **Analytics** - PostHog integration
- **Auth** - Clerk authentication
- **Database** - Drizzle ORM and Neon
- **Jobs** - Trigger.dev background jobs
- **Observability** - Axiom logging
- **Payment** - Stripe subscriptions
- **Types** - TypeScript definitions
- **UI** - shadcn/ui components

### **Applications**

- **API** - Backend REST API
- **App** - Main dashboard application
- **Web** - Marketing landing page
- **Docs** - This documentation site
- **Studio** - Database management

### **Reference**

- **Integrations Overview** - Adding features guide
- **AI Features** - OpenAI integration
- **Email** - Email service integration
- **i18n** - Internationalization
- **File Uploads** - File handling
- **CMS** - Content management
- **Real-time** - WebSocket integration
- **Search** - Full-text search

## Configuration

### **Astro Configuration**

```javascript
// apps/docs/astro.config.mjs
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeNova from "starlight-theme-nova";

export default defineConfig({
  integrations: [
    starlight({
      plugins: [starlightThemeNova()],
      title: "Orion Kit",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/orion-kit/orion",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "introduction" },
            { label: "Quick Start", slug: "quick-start" },
            { label: "Accounts Setup", slug: "guide/accounts-setup" },
            {
              label: "Environment Variables",
              slug: "guide/environment-variables",
            },
          ],
        },
        {
          label: "Guide",
          autogenerate: { directory: "guide" },
        },
        {
          label: "Architecture",
          autogenerate: { directory: "architecture" },
        },
        {
          label: "Packages",
          autogenerate: { directory: "packages" },
        },
        {
          label: "Applications",
          autogenerate: { directory: "apps" },
        },
        {
          label: "Reference",
          items: [
            { label: "Integrations Overview", slug: "reference/integrations" },
            { label: "Adding AI Features", slug: "reference/integrations/ai" },
            { label: "Adding Email", slug: "reference/integrations/email" },
            { label: "Adding i18n", slug: "reference/integrations/i18n" },
            {
              label: "Adding File Uploads",
              slug: "reference/integrations/file-uploads",
            },
            { label: "Adding CMS", slug: "reference/integrations/cms" },
            {
              label: "Adding Real-time",
              slug: "reference/integrations/realtime",
            },
            { label: "Adding Search", slug: "reference/integrations/search" },
          ],
        },
      ],
    }),
  ],
});
```

### **Content Configuration**

```typescript
// apps/docs/src/content.config.ts
import { defineCollection, z } from "astro:content";

const docs = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { docs };
```

## Writing Documentation

### **Markdown Files**

All documentation is written in Markdown with frontmatter:

````markdown
---
title: Package Name
description: Brief description of the package
---

# Package Name

Detailed documentation content...

## Section

Content with code examples:

```typescript
import { example } from "@workspace/package";

const result = example();
```
````

### **Code Examples**

Use syntax highlighting for code blocks:

```typescript
// TypeScript
import { auth } from "@workspace/auth/server";

export async function GET() {
  const { userId } = await auth();
  // ...
}
```

```bash
# Shell commands
pnpm dev
pnpm build
```

```json
{
  "name": "example",
  "version": "1.0.0"
}
```

### **Links and Navigation**

Use relative links for internal documentation:

```markdown
[Quick Start Guide](/quick-start)
[Database Package](/packages/database)
[API Application](/apps/api)
```

### **Images and Assets**

Place images in `src/assets/` and reference them:

```markdown
![Architecture Diagram](/assets/architecture-diagram.png)
```

## Development

### **Start Development Server**

```bash
cd apps/docs
pnpm dev
```

Documentation runs on `http://localhost:3004`

### **Build for Production**

```bash
cd apps/docs
pnpm build
```

### **Preview Production Build**

```bash
cd apps/docs
pnpm preview
```

## Styling and Theming

### **Nova Theme**

Uses Starlight Nova theme for modern styling:

```javascript
// astro.config.mjs
import starlightThemeNova from "starlight-theme-nova";

export default defineConfig({
  integrations: [
    starlight({
      plugins: [starlightThemeNova()],
      // ...
    }),
  ],
});
```

### **Custom CSS**

Add custom styles in `src/styles/` if needed:

```css
/* Custom documentation styles */
.custom-component {
  border: 1px solid var(--sl-color-accent);
  border-radius: var(--sl-border-radius-medium);
  padding: var(--sl-spacing-medium);
}
```

## Content Management

### **File Organization**

Organize content by category:

```
src/content/docs/
├── guide/           # Step-by-step guides
├── packages/        # Package documentation
├── apps/           # Application documentation
├── architecture/   # System architecture
└── reference/      # Integration guides
```

### **Frontmatter**

Use consistent frontmatter across files:

```yaml
---
title: Descriptive Title
description: Brief description for SEO and navigation
---
```

### **Cross-References**

Link related content:

```markdown
## Related

- [Database Package](/packages/database)
- [API Application](/apps/api)
- [Type System](/architecture/type-system)
```

## Production Deployment

### **Vercel Deployment**

```bash
cd apps/docs
vercel --prod
```

### **Custom Domain**

Configure custom domain in Vercel:

```
docs.orion-kit.dev → Documentation site
```

### **Build Configuration**

Vercel automatically detects Astro and builds the site:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install"
}
```

## SEO and Performance

### **Meta Tags**

Starlight automatically generates meta tags from frontmatter:

```yaml
---
title: Package Documentation
description: Comprehensive guide to the package
---
```

### **Search**

Starlight includes built-in search functionality that indexes all content.

### **Performance**

Astro provides excellent performance with:

- Static site generation
- Minimal JavaScript
- Optimized images
- Fast loading times

## Maintenance

### **Content Updates**

Regularly update documentation to match code changes:

1. Update package documentation when APIs change
2. Add new guides for new features
3. Update examples with latest code patterns
4. Review and fix broken links

### **Link Checking**

Check for broken internal links:

```bash
# Use a link checker tool
npx linkinator https://docs.orion-kit.dev --recurse
```

### **Content Review**

Regular content review process:

1. **Accuracy** - Ensure examples work with current code
2. **Completeness** - Cover all features and use cases
3. **Clarity** - Write for different skill levels
4. **Consistency** - Use consistent formatting and style

## Related

- [Web Application](/apps/web)
- [Main Application](/apps/app)
- [API Application](/apps/api)
