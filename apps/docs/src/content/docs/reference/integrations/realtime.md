---
title: Adding Real-time
description: Pusher/Ably for WebSockets
---

# Adding Real-time Features

Real-time updates with **Pusher** (or Ably) for notifications, chat, live updates.

## Pusher Setup

```bash
pnpm add pusher pusher-js

# Get credentials from pusher.com
# apps/api/.env.local
PUSHER_APP_ID=123456
PUSHER_KEY=abc...
PUSHER_SECRET=def...
PUSHER_CLUSTER=us2

# apps/app/.env.local
NEXT_PUBLIC_PUSHER_KEY=abc...
NEXT_PUBLIC_PUSHER_CLUSTER=us2
```

## Server Client

`packages/realtime/src/server.ts`:

```typescript
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
});

export async function sendNotification(userId: string, message: string) {
  await pusher.trigger(`user-${userId}`, "notification", { message });
}

export async function broadcastTaskUpdate(taskId: number, data: any) {
  await pusher.trigger("tasks", "task-updated", { taskId, ...data });
}
```

## Client Hook

`apps/app/hooks/use-pusher.ts`:

```typescript
import Pusher from "pusher-js";
import { useEffect } from "react";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

export function usePusherEvent(
  channel: string,
  event: string,
  callback: (data: any) => void
) {
  useEffect(() => {
    const ch = pusher.subscribe(channel);
    ch.bind(event, callback);
    return () => {
      ch.unbind(event, callback);
      pusher.unsubscribe(channel);
    };
  }, [channel, event, callback]);
}
```

## Usage

**Real-time notifications:**

```typescript
import { usePusherEvent } from "@/hooks/use-pusher";
import { toast } from "sonner";

usePusherEvent(`user-${user.id}`, "notification", (data) => {
  toast.info(data.message);
});
```

**Live task updates:**

```typescript
usePusherEvent("tasks", "task-updated", () => {
  queryClient.invalidateQueries({ queryKey: ["tasks"] });
});
```

**Trigger from API:**

```typescript
import { broadcastTaskUpdate } from "@workspace/realtime/server";

await broadcastTaskUpdate(task.id, task);
```

**Pricing:** Pusher free 100 connections, Ably free 6M messages/mo

[Pusher docs](https://pusher.com/docs) · [Ably docs](https://ably.com/docs)
