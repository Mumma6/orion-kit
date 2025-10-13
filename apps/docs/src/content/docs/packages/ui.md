---
title: UI Package
description: Shared component library with shadcn/ui
---

# @workspace/ui

Shared UI component library based on [shadcn/ui](https://ui.shadcn.com/) with Radix UI primitives and Tailwind CSS.

## Overview

The `@workspace/ui` package provides a set of reusable, accessible React components built with Radix UI and styled with Tailwind CSS.

## Installation

This package is already included in the workspace. To use it in your app:

```json
{
  "dependencies": {
    "@workspace/ui": "workspace:*"
  }
}
```

## Available Components

All components from [shadcn/ui](https://ui.shadcn.com/) with Radix UI primitives.

### Layout

- **Sidebar** - Application sidebar with collapsible sections, menu items, and groups
- **Card** - Flexible card container with header, content, and footer sections
- **Separator** - Visual divider (horizontal or vertical)
- **Sheet** - Slide-out panels from any side

### Form Components

- **Button** - Primary action button with variants (default, destructive, outline, ghost)
- **Button Group** - Grouped buttons with separators
- **Input** - Text input field with proper styling
- **Textarea** - Multi-line text input
- **Form** - Form wrapper with validation support (React Hook Form + Zod)
- **Label** - Accessible form labels

### Data Display

- **Table** - Responsive data tables with header, body, and footer
- **Badge** - Status badges with variants
- **Avatar** - User avatars with fallback
- **Skeleton** - Loading placeholders

### Overlays

- **Dialog** - Modal dialogs with overlay
- **Dropdown Menu** - Contextual menus with items, groups, and separators
- **Tooltip** - Contextual help on hover
- **Collapsible** - Expandable/collapsible sections

### Navigation

- **Breadcrumb** - Navigation breadcrumbs with separators
- **Orion Logo** - Custom Orion Kit logo component

## Usage

```typescript
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";

export function MyComponent() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  );
}
```

## Adding New Components

Use shadcn CLI to add new components:

```bash
cd apps/web  # or apps/app
pnpm dlx shadcn@canary add [component-name]
```

The CLI will automatically install components in `packages/ui` and configure imports.

## Styling

All components use Tailwind CSS and support theme customization through CSS variables. See the individual app's `globals.css` for theme configuration.

## Learn More

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
