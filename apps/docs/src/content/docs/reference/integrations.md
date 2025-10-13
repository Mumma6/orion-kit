---
title: Integration Guides
description: How to add popular features to Orion Kit
---

# Integration Guides

Orion Kit is intentionally minimal to keep the codebase clean and maintainable. Here's how to add popular features when you need them.

## 🤖 AI Features

**What:** OpenAI, Anthropic, Vercel AI SDK, streaming responses

**When to add:** Building AI chat, text generation, embeddings, or AI-powered features

**Guide:** [Adding AI Features →](/reference/integrations/ai)

**Difficulty:** ⭐⭐⭐ Intermediate

---

## 📧 Email

**What:** Resend, transactional emails, email templates, notifications

**When to add:** User onboarding, password resets, notifications, newsletters

**Guide:** [Adding Email →](/reference/integrations/email)

**Difficulty:** ⭐⭐ Easy

---

## 🌍 Internationalization (i18n)

**What:** next-intl, translations, locale routing, multi-language support

**When to add:** Supporting multiple languages and regions

**Guide:** [Adding i18n →](/reference/integrations/i18n)

**Difficulty:** ⭐⭐⭐ Intermediate

---

## 📁 File Uploads

**What:** UploadThing, S3, image optimization, file storage

**When to add:** User avatars, document uploads, media management

**Guide:** [Adding File Uploads →](/reference/integrations/file-uploads)

**Difficulty:** ⭐⭐ Easy

---

## 🎨 CMS Integration

**What:** Sanity, Contentful, headless CMS

**When to add:** Marketing pages, blog, documentation

**Guide:** [Adding CMS →](/reference/integrations/cms)

**Difficulty:** ⭐⭐⭐ Intermediate

---

## 💬 Real-time Features

**What:** Pusher, Ably, WebSockets, real-time updates

**When to add:** Chat, notifications, collaborative features

**Guide:** [Adding Real-time →](/reference/integrations/realtime)

**Difficulty:** ⭐⭐⭐⭐ Advanced

---

## 🔍 Full-text Search

**What:** Algolia, Meilisearch, ElasticSearch

**When to add:** Search functionality, filtering, autocomplete

**Guide:** [Adding Search →](/reference/integrations/search)

**Difficulty:** ⭐⭐⭐ Intermediate

---

## Philosophy

**Start minimal, add only what you need.**

Every integration adds:

- Code complexity
- Dependencies to maintain
- Potential bugs
- Costs (services aren't free)

Only add integrations when you have a **clear use case**.

## Need Help?

Can't find an integration guide? [Open an issue](https://github.com/orion-kit/orion/issues) and we'll consider adding it!
