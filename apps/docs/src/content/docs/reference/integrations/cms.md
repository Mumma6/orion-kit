---
title: Adding CMS
description: Sanity CMS integration
---

# Adding CMS

Headless CMS with **Sanity** for blog posts and marketing content.

## Setup

```bash
cd packages
npx sanity init  # Create new Sanity project

pnpm add next-sanity @sanity/image-url
```

**Environment:**

```bash
# apps/web/.env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

## Schema

`packages/sanity/schemas/post.ts`:

```typescript
export const post = defineType({
  name: "post",
  type: "document",
  fields: [
    { name: "title", type: "string", validation: (Rule) => Rule.required() },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "body", type: "blockContent" },
    { name: "publishedAt", type: "datetime" },
  ],
});
```

## Client

`apps/web/lib/sanity/client.ts`:

```typescript
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});
```

## Fetch Content

```typescript
export async function getAllPosts() {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id, title, slug, publishedAt, body
    }
  `);
}
```

## Blog Page

```typescript
export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div>
      {posts.map(post => (
        <Link key={post._id} href={`/blog/${post.slug.current}`}>
          <h2>{post.title}</h2>
        </Link>
      ))}
    </div>
  );
}
```

**Deploy Studio:** `pnpm sanity deploy` → `https://your-project.sanity.studio`

**Pricing:** Free 100k requests/mo, $99/mo for unlimited

**Alternative:** Contentful

[Sanity docs](https://sanity.io/docs) · [Next.js guide](https://sanity.io/guides/nextjs-app-router)
