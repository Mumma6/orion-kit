---
title: Adding AI Features
description: OpenAI + Vercel AI SDK integration
---

Integrate OpenAI and Vercel AI SDK for chat, text generation, and streaming.

## Quick Setup

```bash
pnpm add ai openai
```

**Environment:**

```bash
# apps/api/.env.local
OPENAI_API_KEY=sk-...
```

## AI Chat API

`apps/api/app/ai/chat/route.ts`:

```typescript
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai";
import { auth } from "@workspace/auth/server";

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messages } = await req.json();
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages,
  });

  return new StreamingTextResponse(OpenAIStream(response));
}
```

## Frontend Hook

`apps/app/hooks/use-ai-chat.ts`:

```typescript
import { useChat } from "ai/react";

export function useAIChat() {
  return useChat({
    api: `${process.env.NEXT_PUBLIC_API_URL}/ai/chat`,
  });
}
```

## Chat Component

```typescript
"use client";
import { useAIChat } from "@/hooks/use-ai-chat";
import { Button, Input } from "@workspace/ui/components";

export function AIChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useAIChat();

  return (
    <div>
      <div>
        {messages.map(m => (
          <div key={m.id}>{m.content}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <Input value={input} onChange={handleInputChange} disabled={isLoading} />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
```

## Cost Management

OpenAI charges per token. Track usage:

```typescript
await db.insert(aiUsage).values({
  userId,
  model: "gpt-3.5-turbo",
  tokensUsed: completion.usage?.total_tokens,
  cost: (completion.usage?.total_tokens ?? 0) * 0.002,
});
```

## Pricing

| Model          | Input    | Output   |
| -------------- | -------- | -------- |
| GPT-3.5 Turbo  | $0.50/1M | $1.50/1M |
| GPT-4 Turbo    | $10/1M   | $30/1M   |
| Claude 3 Haiku | $0.25/1M | $1.25/1M |

[Vercel AI SDK](https://sdk.vercel.ai) · [OpenAI](https://platform.openai.com/docs)
