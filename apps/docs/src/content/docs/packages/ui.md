---
title: UI Package
description: shadcn/ui component library
---

# @workspace/ui

Shared UI components based on **shadcn/ui** with Radix UI primitives and Tailwind CSS.

## Components

**Layout:** Sidebar, Card, Separator, Sheet  
**Forms:** Button, Input, Textarea, Form, Label  
**Data:** Table, Badge, Avatar, Skeleton  
**Overlays:** Dialog, Dropdown Menu, Tooltip, Collapsible  
**Navigation:** Breadcrumb, Orion Logo

Full list: [shadcn/ui components](https://ui.shadcn.com/)

## Usage

```typescript
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";

<Card>
  <Button>Click me</Button>
</Card>
```

## Add New Components

```bash
cd apps/app  # or apps/web
pnpm dlx shadcn@canary add [component-name]
```

Auto-installs in `packages/ui` with proper imports.

[shadcn/ui docs](https://ui.shadcn.com) · [Radix UI](https://radix-ui.com) · [Tailwind](https://tailwindcss.com)
