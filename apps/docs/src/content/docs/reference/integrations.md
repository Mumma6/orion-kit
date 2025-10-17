---
title: Integration Guides
description: Add features to Orion Kit
---

# Integration Guides

Orion Kit is a **production-ready boilerplate**, not a feature-complete platform. We've included the essential SaaS building blocks, but intentionally left out features that aren't needed by every project.

## Available Integrations

Add these features **only when you need them**:

| Feature                                                  | When to Add               | Difficulty | Cost Impact |
| -------------------------------------------------------- | ------------------------- | ---------- | ----------- |
| **[AI Features](/reference/integrations/ai)**            | Chat, text generation     | ⭐⭐⭐     | $20-100/mo  |
| **[Email](/reference/integrations/email)**               | Onboarding, notifications | ⭐⭐       | $10-50/mo   |
| **[i18n](/reference/integrations/i18n)**                 | Multi-language support    | ⭐⭐⭐     | Free        |
| **[File Uploads](/reference/integrations/file-uploads)** | Avatars, documents        | ⭐⭐       | $5-20/mo    |
| **[CMS](/reference/integrations/cms)**                   | Blog, marketing content   | ⭐⭐⭐     | $10-30/mo   |
| **[Real-time](/reference/integrations/realtime)**        | Chat, live updates        | ⭐⭐⭐⭐   | $20-100/mo  |
| **[Search](/reference/integrations/search)**             | Full-text search          | ⭐⭐⭐     | $20-200/mo  |

## Why This Approach?

### 🎯 **Boilerplate Philosophy**

Orion Kit focuses on **universal SaaS needs** that 90% of projects require:

- ✅ **Authentication** - Every SaaS needs user management
- ✅ **Database** - Data persistence is fundamental
- ✅ **Payments** - Most SaaS needs subscription billing
- ✅ **Analytics** - Product insights are essential
- ✅ **Background Jobs** - Most apps need async processing
- ✅ **Type Safety** - Prevents bugs at scale

### 🚫 **What We Don't Include**

Features that are **project-specific** and would bloat the boilerplate:

- ❌ **AI/ML** - Only some apps need chat, text generation
- ❌ **File Uploads** - Not every app handles files
- ❌ **Real-time** - Chat/live updates are niche
- ❌ **i18n** - Many apps are single-language
- ❌ **CMS** - Not every SaaS needs a blog
- ❌ **Search** - Full-text search is optional

### 💡 **The Problem with "Kitchen Sink" Boilerplates**

Most boilerplates try to include everything:

```typescript
// ❌ Bloated boilerplate
import {
  AI,
  Email,
  i18n,
  FileUpload,
  CMS,
  Realtime,
  Search,
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
import { db } from "@workspace/database";

// Build your unique features
export async function createProject(data: CreateProjectInput) {
  const { userId } = await auth();
  // Your business logic here
}
```

### 2. **Add Integrations Incrementally**

Only when you have real users asking for features:

```typescript
// ✅ Add when needed
import { sendEmail } from "@workspace/email"; // Only when you need emails
import { generateText } from "@workspace/ai"; // Only when you need AI
```

### 3. **Measure Before Adding**

Track usage before integrating:

- **Email**: Do users actually need notifications?
- **AI**: Is there real demand for AI features?
- **File Uploads**: Are users asking for file sharing?

## Cost Considerations

Every integration adds ongoing costs:

| Service     | Free Tier | Paid Plans | Monthly Cost |
| ----------- | --------- | ---------- | ------------ |
| **Resend**  | 3k emails | $20/mo     | $0-20        |
| **Neon**    | 512MB     | $19/mo     | $0-19        |
| **Stripe**  | 0.3% fee  | 0.3% fee   | $0 + fees    |
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

## Migration Strategy

When you do add integrations:

### 1. **Start with MVP**

```typescript
// Phase 1: Basic email
import { sendEmail } from "resend";

export async function sendWelcomeEmail(email: string) {
  await sendEmail({
    to: email,
    subject: "Welcome!",
    html: "<h1>Welcome to our app</h1>",
  });
}
```

### 2. **Add Templates**

```typescript
// Phase 2: Email templates
import { renderEmailTemplate } from "@workspace/email/templates";

export async function sendWelcomeEmail(email: string, name: string) {
  const html = await renderEmailTemplate("welcome", { name });
  await sendEmail({ to: email, subject: "Welcome!", html });
}
```

### 3. **Add Advanced Features**

```typescript
// Phase 3: Advanced features
import { EmailProvider } from "@workspace/email";

export async function sendWelcomeEmail(email: string, name: string) {
  await EmailProvider.send({
    template: "welcome",
    to: email,
    data: { name },
    track: true, // Analytics
    schedule: "immediate",
  });
}
```

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
