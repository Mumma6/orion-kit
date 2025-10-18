---
title: Feature Integration
description: Add features to Orion Kit
---

# Feature Integration

Add powerful features to Orion Kit when you need them.

## 🎯 **When to Add Features**

:::tip[Our Philosophy]
Start simple, add features when you have **real user demand** and **clear business value**.
:::

### ✅ **Good Reasons to Add Features**

- **User requests** - Real customers asking for features
- **Business metrics** - Feature will increase revenue/engagement
- **Competitive advantage** - Feature differentiates your product
- **Technical necessity** - Required for core functionality

### ❌ **Avoid These Reasons**

- **"It might be useful"** - YAGNI principle
- **"Other apps have it"** - Copying without validation
- **"It's cool"** - Technology for technology's sake
- **"Easy to add"** - Easy to add, hard to maintain

## 🚀 **Available Integrations**

| Feature                                                    | When to Add            | Difficulty | Cost       | Setup Time |
| ---------------------------------------------------------- | ---------------------- | ---------- | ---------- | ---------- |
| **[Auth Providers](/reference/integrations/auth)**         | Need SSO, social login | ⭐⭐⭐⭐   | $0-25/mo   | 2-4 hours  |
| **[AI Features](/reference/integrations/ai)**              | Chat, text generation  | ⭐⭐⭐     | $20-100/mo | 1-2 hours  |
| **[File Uploads](/reference/integrations/file-uploads)**   | Avatars, documents     | ⭐⭐       | $5-20/mo   | 30-60 min  |
| **[Rate Limiting](/reference/integrations/rate-limiting)** | API protection         | ⭐⭐       | $0-25/mo   | 30-60 min  |
| **[Real-time](/reference/integrations/realtime)**          | Chat, live updates     | ⭐⭐⭐⭐   | $20-100/mo | 2-4 hours  |
| **[Search](/reference/integrations/search)**               | Full-text search       | ⭐⭐⭐     | $20-200/mo | 1-2 hours  |
| **[CMS](/reference/integrations/cms)**                     | Blog, content          | ⭐⭐⭐     | $10-30/mo  | 1-2 hours  |
| **[i18n](/reference/integrations/i18n)**                   | Multi-language         | ⭐⭐⭐     | Free       | 2-4 hours  |

## 💰 **Cost Considerations**

**Base Orion Kit cost:** ~$118/month for full production setup

Adding integrations can easily **double this cost**. Track usage before integrating:

- **AI**: Is there real demand for AI features?
- **File Uploads**: Are users asking for file sharing?
- **Auth Providers**: Do you need SSO, social login, or enterprise features?

## 🔧 **Quick Integration Examples**

### Add File Uploads (30 minutes)

```bash
# 1. Install UploadThing
pnpm add uploadthing @uploadthing/react

# 2. Setup UploadThing
# - Create account at uploadthing.com
# - Add API keys to .env
# - Create upload route

# 3. Add to your app
import { UploadButton } from "@uploadthing/react";

export function FileUpload() {
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        console.log("Files: ", res);
      }}
    />
  );
}
```

### Add Rate Limiting (30 minutes)

```bash
# 1. Install Upstash Redis
pnpm add @upstash/redis

# 2. Setup Upstash
# - Create account at upstash.com
# - Create Redis database
# - Add API keys to .env

# 3. Add to API routes
import { ratelimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  const { success } = await ratelimit.limit("api");
  if (!success) {
    return new Response("Too many requests", { status: 429 });
  }
  // ... your logic
}
```

### Add AI Features (1 hour)

```bash
# 1. Install OpenAI
pnpm add openai

# 2. Setup OpenAI
# - Create account at openai.com
# - Add API key to .env

# 3. Create AI route
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  return NextResponse.json({
    response: completion.choices[0].message.content
  });
}
```

## 📚 **Complete Integration Guides**

For detailed setup instructions, see our complete guides:

- **[Auth Providers](/reference/integrations/auth)** - Clerk, Auth0, Better Auth
- **[AI Features](/reference/integrations/ai)** - OpenAI, streaming, chat
- **[File Uploads](/reference/integrations/file-uploads)** - UploadThing, S3
- **[Rate Limiting](/reference/integrations/rate-limiting)** - Upstash Redis
- **[Real-time](/reference/integrations/realtime)** - Pusher, WebSockets
- **[Search](/reference/integrations/search)** - Algolia, Meilisearch
- **[CMS](/reference/integrations/cms)** - Sanity, Contentful
- **[i18n](/reference/integrations/i18n)** - next-intl, translations

## 🎯 **Integration Strategy**

### 1. **Start with Core Features**

Build your MVP with what's included:

```typescript
// ✅ Use what's already there
import { auth } from "@workspace/auth/server";
import { createCheckoutSession } from "@workspace/payment/server";
import { sendEmail } from "@workspace/email/server";
import { db } from "@workspace/database";

// Build your unique features
export async function createProject(data: CreateProjectInput) {
  const { userId } = await auth();

  // Create project
  const project = await db.insert(projects).values({ ...data, userId });

  // Send welcome email
  await sendEmail({
    to: user.email,
    template: "project-created",
    data: { projectName: data.name },
  });

  return project;
}
```

### 2. **Add Integrations Incrementally**

Only when you have real users asking for features:

```typescript
// ✅ Add when needed
import { generateText } from "@workspace/ai"; // Only when you need AI
import { ClerkProvider } from "@clerk/nextjs"; // Only when you need auth providers
```

### 3. **Measure Before Adding**

Track usage before integrating:

- **Auth Providers**: Do you need SSO, social login, or enterprise features?
- **AI**: Is there real demand for AI features?
- **File Uploads**: Are users asking for file sharing?

## 🚀 **Next Steps**

- [Customize your app](/getting-started/customization)
- [Deploy to production](/getting-started/deployment)
- [Learn architecture](/architecture/overview)

---

**Need help with a specific integration?** [Open an issue](https://github.com/Mumma6/orion-kit/issues) or check our [Complete Integration Guides](/reference/integrations).
