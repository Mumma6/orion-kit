---
title: Adding Search
description: Integrate Algolia or Meilisearch for full-text search
---

# Adding Search

Complete guide to adding full-text search using Algolia or Meilisearch.

## What You'll Get

- ✅ Fast full-text search
- ✅ Typo tolerance
- ✅ Instant results
- ✅ Faceted filtering
- ✅ Autocomplete
- ✅ Relevance ranking

## Algolia vs Meilisearch

| Feature          | Algolia            | Meilisearch          |
| ---------------- | ------------------ | -------------------- |
| Hosting          | Cloud only         | Cloud or self-hosted |
| Free Tier        | 10k searches/month | 100k docs (cloud)    |
| Pricing          | $0.50/1k searches  | $19/mo (cloud)       |
| Setup Complexity | ⭐⭐ Easy          | ⭐⭐⭐ Moderate      |
| Speed            | ⚡⚡⚡ Very Fast   | ⚡⚡⚡ Very Fast     |

**Recommendation:** Use Algolia for simplicity, Meilisearch for cost savings.

---

## Option 1: Algolia

### Step 1: Create Account

1. Go to [algolia.com](https://www.algolia.com/)
2. Sign up (free tier: 10k searches/month)
3. Create an application
4. Create an index (e.g., `tasks`)

### Step 2: Install Dependencies

```bash
pnpm add algoliasearch react-instantsearch
```

### Step 3: Add Environment Variables

**`apps/api/.env.local`:**

```bash
ALGOLIA_APP_ID=ABC123
ALGOLIA_ADMIN_KEY=abc123...  # Admin key (secret!)
```

**`apps/app/.env.local`:**

```bash
NEXT_PUBLIC_ALGOLIA_APP_ID=ABC123
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=xyz789...  # Search-only key (public)
```

### Step 4: Create Search Package

Create `packages/search/src/algolia.ts`:

```typescript
import algoliasearch from "algoliasearch";

// Server-side client (with admin key)
export const algoliaAdmin = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
);

export const tasksIndex = algoliaAdmin.initIndex("tasks");

// Sync task to Algolia
export async function indexTask(task: {
  id: number;
  title: string;
  description: string | null;
  status: string;
  createdAt: Date;
}) {
  await tasksIndex.saveObject({
    objectID: task.id.toString(),
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    createdAt: task.createdAt.getTime(),
  });
}

// Remove task from Algolia
export async function removeTask(taskId: number) {
  await tasksIndex.deleteObject(taskId.toString());
}

// Batch sync all tasks
export async function syncAllTasks(tasks: any[]) {
  const objects = tasks.map((task) => ({
    objectID: task.id.toString(),
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    createdAt: task.createdAt.getTime(),
  }));

  await tasksIndex.saveObjects(objects);
}
```

### Step 5: Index on Task Changes

Update task API routes:

```typescript
import { indexTask, removeTask } from "@workspace/search/algolia";

// When creating task
export async function POST(req: Request) {
  // ... create task

  // Index in Algolia
  await indexTask(newTask);

  return NextResponse.json({ success: true, data: newTask });
}

// When updating task
export async function PATCH(req: Request) {
  // ... update task

  // Re-index
  await indexTask(updatedTask);

  return NextResponse.json({ success: true, data: updatedTask });
}

// When deleting task
export async function DELETE(req: Request) {
  // ... delete task

  // Remove from index
  await removeTask(taskId);

  return NextResponse.json({ success: true });
}
```

### Step 6: Create Search UI

Create `apps/app/components/search/search-box.tsx`:

```typescript
"use client";

import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch";
import { Task } from "@workspace/database";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

function Hit({ hit }: { hit: any }) {
  return (
    <div className="border-b p-4 hover:bg-accent">
      <h3 className="font-semibold">{hit.title}</h3>
      <p className="text-sm text-muted-foreground">{hit.description}</p>
      <span className="text-xs">{hit.status}</span>
    </div>
  );
}

export function TaskSearch() {
  return (
    <InstantSearch searchClient={searchClient} indexName="tasks">
      <div className="space-y-4">
        <SearchBox
          placeholder="Search tasks..."
          classNames={{
            input: "w-full rounded-md border px-4 py-2",
            submit: "hidden",
            reset: "hidden",
          }}
        />
        <Hits hitComponent={Hit} />
      </div>
    </InstantSearch>
  );
}
```

### Step 7: Add to Dashboard

```typescript
import { TaskSearch } from "@/components/search/search-box";

export default function TasksPage() {
  return (
    <div>
      <TaskSearch />
      {/* Rest of tasks UI */}
    </div>
  );
}
```

---

## Option 2: Meilisearch

### Step 1: Self-Host or Use Cloud

**Cloud (Easier):**

1. Go to [meilisearch.com](https://www.meilisearch.com/)
2. Sign up for cloud hosting
3. Create instance

**Self-Host (Cheaper):**

```bash
docker run -p 7700:7700 getmeili/meilisearch:latest
```

### Step 2: Install Dependencies

```bash
pnpm add meilisearch
```

### Step 3: Create Client

Create `packages/search/src/meilisearch.ts`:

```typescript
import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST ?? "http://localhost:7700",
  apiKey: process.env.MEILISEARCH_API_KEY,
});

export const tasksIndex = client.index("tasks");

export async function searchTasks(query: string) {
  const results = await tasksIndex.search(query, {
    limit: 20,
    attributesToHighlight: ["title", "description"],
  });

  return results.hits;
}

export async function indexTask(task: any) {
  await tasksIndex.addDocuments([
    {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
    },
  ]);
}
```

---

## Advanced Features

### Faceted Search

Filter by status, date, etc:

```typescript
const results = await tasksIndex.search("project", {
  facets: ["status", "priority"],
  filter: ["status = completed"],
});
```

### Autocomplete

```typescript
"use client";

import { useState, useEffect } from "react";
import { searchTasks } from "@/lib/search";

export function Autocomplete() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const search = async () => {
      const results = await searchTasks(query);
      setSuggestions(results.slice(0, 5));
    };

    const timer = setTimeout(search, 300); // Debounce
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Typo Tolerance

Both Algolia and Meilisearch handle typos automatically:

- "taks" → finds "tasks"
- "projetc" → finds "project"

### Synonyms

Configure synonyms in Algolia/Meilisearch dashboard:

```json
{
  "todo": ["to-do", "pending", "upcoming"],
  "done": ["completed", "finished"]
}
```

## Performance

### Debounce Search

```typescript
const debouncedSearch = useMemo(
  () =>
    debounce((query: string) => {
      searchTasks(query);
    }, 300),
  []
);
```

### Cache Results

```typescript
const { data } = useQuery({
  queryKey: ["search", query],
  queryFn: () => searchTasks(query),
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
});
```

## Initial Sync

Sync existing data to search index:

```bash
# Create sync script
packages/search/scripts/sync.ts
```

```typescript
import { db, tasks } from "@workspace/database";
import { syncAllTasks } from "../src/algolia";

async function sync() {
  const allTasks = await db.select().from(tasks);
  await syncAllTasks(allTasks);
  console.log(`Synced ${allTasks.length} tasks`);
}

sync().catch(console.error);
```

Run with:

```bash
npx tsx packages/search/scripts/sync.ts
```

## Pricing

### Algolia

| Plan     | Searches/month | Price  |
| -------- | -------------- | ------ |
| Free     | 10,000         | $0     |
| Standard | 100,000        | $50/mo |
| Premium  | Unlimited      | Custom |

### Meilisearch Cloud

| Plan     | Documents | Price  |
| -------- | --------- | ------ |
| Sandbox  | 100k      | $0     |
| Starter  | 1M        | $19/mo |
| Business | 10M       | $99/mo |

### Self-hosted Meilisearch

Free! But requires server costs (~$5-20/mo for VPS).

## Learn More

- [Algolia Documentation](https://www.algolia.com/doc/)
- [Meilisearch Documentation](https://www.meilisearch.com/docs)
- [React InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/)
