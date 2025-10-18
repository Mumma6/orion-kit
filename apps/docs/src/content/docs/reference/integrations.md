---
title: Integration Guides
description: Add features to Orion Kit
---

# Integration Guides

:::tip[TL;DR]
Orion Kit includes 90% of what you need. Add integrations only when you have real user demand and clear business value. Start simple, scale smart.
:::

Orion Kit is a **production-ready boilerplate** with essential SaaS features built-in. We've included what 90% of projects need, but left out features that are project-specific or can be easily swapped.

## Available Integrations

Add these features **only when you need them**:

| Feature                                                    | When to Add             | Difficulty | Cost Impact |
| ---------------------------------------------------------- | ----------------------- | ---------- | ----------- |
| **[Auth Providers](/reference/integrations/auth)**         | Replace custom JWT      | ⭐⭐⭐⭐   | $0-25/mo    |
| **[AI Features](/reference/integrations/ai)**              | Chat, text generation   | ⭐⭐⭐     | $20-100/mo  |
| **[i18n](/reference/integrations/i18n)**                   | Multi-language support  | ⭐⭐⭐     | Free        |
| **[File Uploads](/reference/integrations/file-uploads)**   | Avatars, documents      | ⭐⭐       | $5-20/mo    |
| **[CMS](/reference/integrations/cms)**                     | Blog, marketing content | ⭐⭐⭐     | $10-30/mo   |
| **[Real-time](/reference/integrations/realtime)**          | Chat, live updates      | ⭐⭐⭐⭐   | $20-100/mo  |
| **[Search](/reference/integrations/search)**               | Full-text search        | ⭐⭐⭐     | $20-200/mo  |
| **[Rate Limiting](/reference/integrations/rate-limiting)** | API protection, caching | ⭐⭐       | $0-25/mo    |

## Why This Approach?

### 🎯 **Boilerplate Philosophy**

Orion Kit focuses on **universal SaaS needs** that 90% of projects require:

- ✅ **Authentication** - Custom JWT system (can be swapped for providers)
- ✅ **Database** - Neon PostgreSQL with Drizzle ORM
- ✅ **Payments** - Stripe subscriptions with webhooks
- ✅ **Email** - Resend with React Email templates
- ✅ **Analytics** - PostHog for user behavior tracking
- ✅ **Background Jobs** - Trigger.dev for async processing
- ✅ **Type Safety** - End-to-end TypeScript from DB to UI

### 🚫 **What We Don't Include**

Features that are **project-specific** and would bloat the boilerplate:

- ❌ **Auth Providers** - Custom JWT works for most cases
- ❌ **AI/ML** - Only some apps need chat, text generation
- ❌ **File Uploads** - Not every app handles files
- ❌ **Real-time** - Chat/live updates are niche
- ❌ **i18n** - Many apps are single-language
- ❌ **CMS** - Not every SaaS needs a blog
- ❌ **Search** - Full-text search is optional
- ❌ **Rate Limiting** - Not needed for MVP

### 💡 **The Problem with "Kitchen Sink" Boilerplates**

Most boilerplates try to include everything:

```typescript
// ❌ Bloated boilerplate
import {
  Clerk,
  AI,
  i18n,
  FileUpload,
  CMS,
  Realtime,
  Search,
  RateLimit,
} from "kitchen-sink";

// Result: 50+ dependencies, complex setup, unused code
```

**Problems:**

- 🐌 **Slow builds** - Unnecessary dependencies
- 💰 **Higher costs** - Paying for unused services
- 🧠 **Cognitive load** - Too many concepts to learn
- 🔧 **Maintenance** - More code = more bugs
- 📦 **Bundle size** - Larger client bundles

## Integration Strategy

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

## Cost Considerations

Every integration adds ongoing costs:

| Service     | Free Tier | Paid Plans | Monthly Cost |
| ----------- | --------- | ---------- | ------------ |
| **Neon**    | 512MB     | $19/mo     | $0-19        |
| **Stripe**  | 0.3% fee  | 0.3% fee   | $0 + fees    |
| **Resend**  | 3k emails | $20/mo     | $0-20        |
| **PostHog** | 1M events | $20/mo     | $0-20        |
| **Axiom**   | 1GB logs  | $25/mo     | $0-25        |
| **Trigger** | 100k runs | $29/mo     | $0-29        |

**Total base cost: ~$118/month** for full production setup.

Adding integrations can easily double this cost.

## When to Add Integrations

### ✅ **Good Reasons**

- **User requests** - Real customers asking for features
- **Business metrics** - Feature will increase revenue/engagement
- **Competitive advantage** - Feature differentiates your product
- **Technical necessity** - Required for core functionality

### ❌ **Bad Reasons**

- **"It might be useful"** - YAGNI principle
- **"Other apps have it"** - Copying without validation
- **"It's cool"** - Technology for technology's sake
- **"Easy to add"** - Easy to add, hard to maintain

## Philosophy

**"Perfect is the enemy of good."**

Orion Kit gives you a solid foundation. Add features when you have:

- ✅ **Real user demand**
- ✅ **Clear business value**
- ✅ **Technical necessity**
- ✅ **Budget for ongoing costs**

**Start simple, scale smart.** 🚀

---

Need help with a specific integration? [Open an issue](https://github.com/orion-kit/orion/issues) or check our [community discussions](https://github.com/orion-kit/orion/discussions).
