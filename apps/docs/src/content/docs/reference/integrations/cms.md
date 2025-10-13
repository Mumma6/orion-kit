---
title: Adding CMS
description: Integrate Sanity CMS for content management
---

# Adding CMS

Complete guide to integrating Sanity CMS for content management.

## What You'll Get

- ✅ Headless CMS
- ✅ Visual content editor
- ✅ Real-time preview
- ✅ Type-safe content
- ✅ Image CDN
- ✅ Version history

## Why Sanity?

- Best-in-class editor experience
- Excellent Next.js integration
- Real-time collaboration
- Free tier (100k requests/month)
- Portable Text (structured content)

## Alternative: Contentful

Use Contentful if you prefer:

- More enterprise features
- Simpler content modeling
- Different pricing model

## Step 1: Create Sanity Project

```bash
# Install Sanity CLI
pnpm add -g @sanity/cli

# Create new project
cd packages
npx sanity init

# Select:
# - Create new project
# - Project name: "Orion CMS"
# - Use default dataset: "production"
# - Output path: sanity
```

## Step 2: Configure Schema

Create `packages/sanity/schemas/post.ts`:

```typescript
import { defineType, defineField } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
  ],
});
```

## Step 3: Install in Frontend

```bash
# Install Sanity client
pnpm add next-sanity @sanity/image-url
```

## Step 4: Create Sanity Client

Create `apps/web/lib/sanity/client.ts`:

```typescript
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true, // Enable for production
});
```

## Step 5: Fetch Content

Create `apps/web/lib/sanity/queries.ts`:

```typescript
import { client } from "./client";

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  author: string;
  publishedAt: string;
  body: any;
  mainImage?: {
    asset: {
      url: string;
    };
  };
}

export async function getAllPosts(): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      author,
      publishedAt,
      mainImage {
        asset -> { url }
      },
      body
    }`
  );
}

export async function getPost(slug: string): Promise<Post> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      author,
      publishedAt,
      mainImage {
        asset -> { url }
      },
      body
    }`,
    { slug }
  );
}
```

## Step 6: Create Blog Page

Create `apps/web/app/blog/page.tsx`:

```typescript
import { getAllPosts } from "@/lib/sanity/queries";
import Link from "next/link";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-4xl font-bold">Blog</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug.current}`}
            className="group"
          >
            <article className="overflow-hidden rounded-lg border">
              {post.mainImage && (
                <img
                  src={post.mainImage.asset.url}
                  alt={post.title}
                  className="aspect-video w-full object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold group-hover:underline">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

## Step 7: Add Environment Variables

Add to `apps/web/.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk...  # For preview mode
```

## Real-time Preview

Enable preview mode for editors:

```typescript
import { definePreview } from "next-sanity/preview";
import { client } from "./client";

export const usePreview = definePreview({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
});
```

## Deploy Sanity Studio

```bash
cd packages/sanity

# Deploy studio
pnpm sanity deploy

# Opens at: https://your-project.sanity.studio
```

## Portable Text Rendering

Render rich text content:

```bash
pnpm add @portabletext/react
```

```typescript
import { PortableText } from "@portabletext/react";

export function BlogPost({ post }: { post: Post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <PortableText value={post.body} />
    </article>
  );
}
```

## Best Practices

### 1. Use TypeScript

Generate types from Sanity schema:

```bash
pnpm sanity typegen generate
```

### 2. Optimize Images

```typescript
import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Usage
<img
  src={urlFor(post.mainImage).width(800).height(450).url()}
  alt={post.title}
/>
```

### 3. Cache Content

```typescript
export const revalidate = 3600; // Revalidate every hour

export async function getAllPosts() {
  return client.fetch(/* ... */, {}, { next: { revalidate: 3600 } });
}
```

## Pricing

### Sanity

| Plan | Documents | Requests  | Price  |
| ---- | --------- | --------- | ------ |
| Free | Unlimited | 100k/mo   | $0     |
| Team | Unlimited | Unlimited | $99/mo |

### Contentful

| Plan  | Entries | Users | Price   |
| ----- | ------- | ----- | ------- |
| Free  | 25k     | 5     | $0      |
| Basic | 100k    | 10    | $489/mo |

## Learn More

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity + Next.js Guide](https://www.sanity.io/guides/nextjs-app-router)
- [Contentful Documentation](https://www.contentful.com/developers/docs/)
