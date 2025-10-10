---
title: UI Components
---

# UI Components

Shared UI component library based on [shadcn/ui](https://ui.shadcn.com/).

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

### Layout Components

- `Sidebar` - Application sidebar with collapsible sections
- `Card` - Flexible card container
- `Separator` - Visual divider

### Form Components

- `Button` - Primary action button
- `Input` - Text input field
- `Textarea` - Multi-line text input
- `Form` - Form wrapper with validation support
- `Label` - Accessible form labels

### Data Display

- `Table` - Data tables
- `Badge` - Status badges
- `Avatar` - User avatars
- `Tooltip` - Contextual help

### Navigation

- `Breadcrumb` - Navigation breadcrumbs
- `Dropdown Menu` - Contextual menus
- `Sheet` - Slide-out panels

### Feedback

- `Skeleton` - Loading placeholders

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
