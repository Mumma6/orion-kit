---
title: Adding Real-time Features
description: Integrate Pusher or Ably for real-time updates
---

# Adding Real-time Features

Complete guide to adding real-time functionality using Pusher or Ably.

## What You'll Get

- ✅ Real-time notifications
- ✅ Live updates
- ✅ WebSocket connections
- ✅ Presence indicators
- ✅ Chat/messaging

## Pusher vs Ably

| Feature   | Pusher                         | Ably                    |
| --------- | ------------------------------ | ----------------------- |
| Free Tier | 100 connections, 200k messages | 6M messages/month       |
| Pricing   | $49/mo for 500 connections     | $29/mo for 50M messages |
| Best For  | Small to medium apps           | High-traffic apps       |
| DX        | ⭐⭐⭐⭐⭐                     | ⭐⭐⭐⭐                |

**Recommendation:** Start with Pusher for simplicity.

---

## Option 1: Pusher

### Step 1: Create Account

1. Go to [pusher.com](https://pusher.com)
2. Sign up and create new app
3. Select region closest to users
4. Copy credentials

### Step 2: Install Dependencies

```bash
pnpm add pusher pusher-js
```

### Step 3: Add Environment Variables

**`apps/api/.env.local`:**

```bash
PUSHER_APP_ID=123456
PUSHER_KEY=abc123...
PUSHER_SECRET=def456...
PUSHER_CLUSTER=us2
```

**`apps/app/.env.local`:**

```bash
NEXT_PUBLIC_PUSHER_KEY=abc123...
NEXT_PUBLIC_PUSHER_CLUSTER=us2
```

### Step 4: Create Server Client

Create `packages/realtime/src/server.ts`:

```typescript
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function sendNotification(userId: string, message: string) {
  await pusher.trigger(`user-${userId}`, "notification", {
    message,
    timestamp: new Date().toISOString(),
  });
}

export async function broadcastTaskUpdate(taskId: number, data: any) {
  await pusher.trigger("tasks", "task-updated", {
    taskId,
    ...data,
  });
}

export { pusher };
```

### Step 5: Create Client Hook

Create `apps/app/hooks/use-pusher.ts`:

```typescript
"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

export function usePusherChannel(channelName: string) {
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    const pusherChannel = pusher.subscribe(channelName);
    setChannel(pusherChannel);

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [channelName]);

  return channel;
}

export function usePusherEvent(
  channelName: string,
  eventName: string,
  callback: (data: any) => void
) {
  const channel = usePusherChannel(channelName);

  useEffect(() => {
    if (!channel) return;

    channel.bind(eventName, callback);

    return () => {
      channel.unbind(eventName, callback);
    };
  }, [channel, eventName, callback]);
}
```

### Step 6: Use in Components

Real-time notifications:

```typescript
"use client";

import { usePusherEvent } from "@/hooks/use-pusher";
import { useUser } from "@workspace/auth/client";
import { toast } from "sonner";

export function RealtimeNotifications() {
  const { user } = useUser();

  usePusherEvent(
    `user-${user?.id}`,
    "notification",
    (data: { message: string }) => {
      toast.info(data.message);
    }
  );

  return null; // Just subscribes to events
}
```

Live task updates:

```typescript
"use client";

import { usePusherEvent } from "@/hooks/use-pusher";
import { useQueryClient } from "@tanstack/react-query";

export function RealtimeTaskUpdates() {
  const queryClient = useQueryClient();

  usePusherEvent("tasks", "task-updated", (data) => {
    // Invalidate tasks cache to refetch
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  });

  return null;
}
```

### Step 7: Trigger Events from API

Update task API route:

```typescript
import {
  sendNotification,
  broadcastTaskUpdate,
} from "@workspace/realtime/server";

export async function POST(req: Request) {
  // ... create task

  // Broadcast update
  await broadcastTaskUpdate(newTask.id, newTask);

  // Send notification to user
  await sendNotification(userId, `Task "${newTask.title}" created`);

  return NextResponse.json({ success: true, data: newTask });
}
```

---

## Option 2: Ably

### Step 1: Create Account

1. Go to [ably.com](https://ably.com)
2. Sign up and create app
3. Copy API key

### Step 2: Install Dependencies

```bash
pnpm add ably
```

### Step 3: Setup Similar to Pusher

```typescript
import Ably from "ably";

const ably = new Ably.Realtime({
  key: process.env.ABLY_API_KEY,
});

const channel = ably.channels.get("tasks");

channel.publish("task-created", { taskId: 123 });
```

---

## Advanced: Presence

Show who's online:

```typescript
const channel = pusher.subscribe("presence-dashboard");

channel.bind("pusher:subscription_succeeded", (members) => {
  console.log("Online users:", members.count);
});

channel.bind("pusher:member_added", (member) => {
  toast.info(`${member.info.name} joined`);
});

channel.bind("pusher:member_removed", (member) => {
  toast.info(`${member.info.name} left`);
});
```

## Use Cases

### Real-time Chat

```typescript
export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);

  usePusherEvent("chat", "new-message", (data: Message) => {
    setMessages((prev) => [...prev, data]);
  });

  const sendMessage = async (text: string) => {
    await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  };

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.text}</div>
      ))}
      <input onSubmit={(e) => sendMessage(e.target.value)} />
    </div>
  );
}
```

### Live Notifications

```typescript
export function LiveNotifications() {
  const { user } = useUser();

  usePusherEvent(`user-${user?.id}`, "notification", (data) => {
    toast.info(data.message);
  });

  return <BellIcon />;
}
```

### Collaborative Editing

```typescript
export function CollaborativeEditor() {
  const [content, setContent] = useState("");

  usePusherEvent("document", "content-changed", (data) => {
    setContent(data.content);
  });

  const handleChange = (newContent: string) => {
    setContent(newContent);
    fetch("/api/document/update", {
      method: "POST",
      body: JSON.stringify({ content: newContent }),
    });
  };

  return <textarea value={content} onChange={(e) => handleChange(e.target.value)} />;
}
```

## Security

### 1. Authenticate Channels

```typescript
// apps/api/app/pusher/auth/route.ts
import { auth } from "@workspace/auth/server";
import { pusher } from "@workspace/realtime/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { socket_id, channel_name } = await req.json();

  // Only allow users to subscribe to their own channel
  if (channel_name !== `private-user-${userId}`) {
    return new Response("Forbidden", { status: 403 });
  }

  const authResponse = pusher.authorizeChannel(socket_id, channel_name);
  return Response.json(authResponse);
}
```

### 2. Rate Limiting

Limit events per user:

```typescript
const rateLimiter = new Map<string, number>();

export async function sendEvent(userId: string, event: string) {
  const count = rateLimiter.get(userId) ?? 0;

  if (count > 100) {
    throw new Error("Rate limit exceeded");
  }

  rateLimiter.set(userId, count + 1);
  await pusher.trigger(/* ... */);

  // Reset after 1 minute
  setTimeout(() => rateLimiter.delete(userId), 60000);
}
```

## Best Practices

### 1. Optimize Connections

```typescript
// ✅ Good - single connection, multiple channels
const pusher = new Pusher(/* ... */);
pusher.subscribe("channel-1");
pusher.subscribe("channel-2");

// ❌ Bad - multiple connections
const pusher1 = new Pusher(/* ... */);
const pusher2 = new Pusher(/* ... */);
```

### 2. Unsubscribe on Unmount

```typescript
useEffect(() => {
  const channel = pusher.subscribe("tasks");

  return () => {
    pusher.unsubscribe("tasks"); // Clean up!
  };
}, []);
```

### 3. Handle Connection Errors

```typescript
pusher.connection.bind("error", (error) => {
  console.error("Pusher error:", error);
  toast.error("Lost connection. Retrying...");
});

pusher.connection.bind("connected", () => {
  toast.success("Connected!");
});
```

## Testing

Mock Pusher in tests:

```typescript
vi.mock("pusher-js", () => ({
  default: vi.fn(() => ({
    subscribe: vi.fn(() => ({
      bind: vi.fn(),
      unbind: vi.fn(),
    })),
  })),
}));
```

## Pricing

### Pusher

- Free: 100 connections, 200k messages/day
- Startup: $49/mo - 500 connections
- Professional: $299/mo - 2000 connections

### Ably

- Free: 6M messages/month
- Standard: $29/mo - 50M messages
- Pro: $299/mo - 500M messages

## Learn More

- [Pusher Documentation](https://pusher.com/docs)
- [Ably Documentation](https://ably.com/docs)
- [WebSockets Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
