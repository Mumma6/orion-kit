---
title: Adding Search
description: Algolia/Meilisearch full-text search
---

Full-text search with **Algolia** (easier) or **Meilisearch** (cheaper).

## Algolia Setup

```bash
pnpm add algoliasearch react-instantsearch

# Get keys from algolia.com
# apps/api/.env.local
ALGOLIA_APP_ID=ABC123
ALGOLIA_ADMIN_KEY=abc...

# apps/app/.env.local
NEXT_PUBLIC_ALGOLIA_APP_ID=ABC123
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=xyz...  # Search-only key
```

## Index on Changes

`packages/search/src/algolia.ts`:

```typescript
import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
);

const tasksIndex = client.initIndex("tasks");

export async function indexTask(task: Task) {
  await tasksIndex.saveObject({
    objectID: task.id.toString(),
    title: task.title,
    description: task.description ?? "",
    status: task.status,
  });
}
```

Update API routes to call `indexTask()` after create/update.

## Search UI

```typescript
"use client";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

export function TaskSearch() {
  return (
    <InstantSearch searchClient={searchClient} indexName="tasks">
      <SearchBox placeholder="Search..." />
      <Hits />
    </InstantSearch>
  );
}
```

## Meilisearch Alternative

Self-host or use cloud. Cheaper for high volume.

```bash
docker run -p 7700:7700 getmeili/meilisearch
pnpm add meilisearch
```

**Pricing:** Algolia $0.50/1k searches, Meilisearch free (self-hosted) or $19/mo cloud

[Algolia docs](https://algolia.com/doc) · [Meilisearch docs](https://meilisearch.com/docs)
