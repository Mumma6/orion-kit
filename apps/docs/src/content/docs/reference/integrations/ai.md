---
title: Adding AI Features
description: Integrate OpenAI and Vercel AI SDK into Orion Kit
---

# Adding AI Features

Complete guide to integrating AI capabilities using Vercel AI SDK and OpenAI.

## What You'll Get

- ✅ OpenAI integration (GPT-4, GPT-3.5)
- ✅ Streaming responses
- ✅ Chat interface
- ✅ Text generation
- ✅ Type-safe AI hooks

## Prerequisites

- OpenAI account with API key ([Get one here](https://platform.openai.com/api-keys))
- Basic understanding of async/await

## Step 1: Install Dependencies

```bash
# Install Vercel AI SDK
pnpm add ai

# Install OpenAI SDK
pnpm add openai

# Install Zod for validation
pnpm add zod
```

## Step 2: Add Environment Variables

Add to `apps/api/.env.local`:

```bash
OPENAI_API_KEY=sk-...
```

## Step 3: Create AI API Route

Create `apps/api/app/ai/chat/route.ts`:

```typescript
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai";
import { auth } from "@workspace/auth/server";
import { NextResponse } from "next/server";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  // Authenticate user
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse request
  const { messages } = await req.json();

  // Call OpenAI
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages,
  });

  // Convert to stream
  const stream = OpenAIStream(response);

  // Return streaming response
  return new StreamingTextResponse(stream);
}
```

## Step 4: Create Frontend Hook

Create `apps/app/hooks/use-ai-chat.ts`:

```typescript
import { useChat } from "ai/react";

export function useAIChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai/chat`,
    });

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  };
}
```

## Step 5: Create Chat Component

Create `apps/app/components/ai/chat.tsx`:

```typescript
"use client";

import { useAIChat } from "@/hooks/use-ai-chat";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card } from "@workspace/ui/components/card";

export function AIChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useAIChat();

  return (
    <div className="flex h-screen flex-col">
      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={
              message.role === "user" ? "ml-auto bg-primary" : "mr-auto"
            }
          >
            <p>{message.content}</p>
          </Card>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 p-4">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
```

## Step 6: Use in Your App

Add to `apps/app/app/dashboard/ai/page.tsx`:

```typescript
import { AIChat } from "@/components/ai/chat";

export default function AIPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-4 text-3xl font-bold">AI Chat</h1>
      <AIChat />
    </div>
  );
}
```

## Advanced: Text Generation

For non-chat use cases (e.g., content generation):

```typescript
// apps/api/app/ai/generate/route.ts
import { auth } from "@workspace/auth/server";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateSchema = z.object({
  prompt: z.string().min(1).max(1000),
  maxTokens: z.number().min(1).max(2000).optional(),
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { prompt, maxTokens = 500 } = generateSchema.parse(body);

  const completion = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt,
    max_tokens: maxTokens,
  });

  return NextResponse.json({
    text: completion.choices[0].text,
  });
}
```

## Cost Management

OpenAI charges per token. Add usage tracking:

```typescript
// Track tokens in database
import { db, aiUsage } from "@workspace/database";

await db.insert(aiUsage).values({
  userId,
  model: "gpt-3.5-turbo",
  tokensUsed: completion.usage?.total_tokens,
  cost: (completion.usage?.total_tokens ?? 0) * 0.002, // $0.002/1K tokens
});
```

## Best Practices

### 1. Rate Limiting

```typescript
// Use Vercel's rate limiting or implement your own
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: /* your redis instance */,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
});

const { success } = await ratelimit.limit(userId);
if (!success) {
  return NextResponse.json({ error: "Too many requests" }, { status: 429 });
}
```

### 2. Input Validation

```typescript
const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().min(1).max(2000),
      })
    )
    .max(50), // Limit conversation history
});
```

### 3. Error Handling

```typescript
try {
  const response = await openai.createChatCompletion(/* ... */);
  // ...
} catch (error) {
  console.error("OpenAI error:", error);
  return NextResponse.json(
    { error: "AI service temporarily unavailable" },
    { status: 503 }
  );
}
```

## Alternative: Anthropic Claude

To use Claude instead:

```bash
pnpm add @anthropic-ai/sdk
```

```typescript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.messages.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello, Claude" }],
});
```

## Pricing Comparison

| Provider  | Model          | Price (per 1M tokens) | Speed  |
| --------- | -------------- | --------------------- | ------ |
| OpenAI    | GPT-3.5 Turbo  | $0.50 / $1.50         | Fast   |
| OpenAI    | GPT-4          | $30 / $60             | Medium |
| OpenAI    | GPT-4 Turbo    | $10 / $30             | Fast   |
| Anthropic | Claude 3 Haiku | $0.25 / $1.25         | Fast   |
| Anthropic | Claude 3 Opus  | $15 / $75             | Medium |

_First number = input, second = output tokens_

## Learn More

- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Anthropic Docs](https://docs.anthropic.com/)
