---
title: Adding File Uploads
description: UploadThing for file uploads
---

# Adding File Uploads

Drag-and-drop uploads with **UploadThing** (or AWS S3).

## UploadThing Setup

```bash
pnpm add uploadthing @uploadthing/react

# Get keys from uploadthing.com
# apps/api/.env.local
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=your_app_id

# apps/app/.env.local
NEXT_PUBLIC_UPLOADTHING_APP_ID=your_app_id
```

## Upload Router

`apps/api/app/api/uploadthing/core.ts`:

```typescript
import { createUploadthing } from "uploadthing/next";
import { auth } from "@workspace/auth/server";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      console.log("Uploaded:", file.url, "by", metadata.userId);
      return { url: file.url };
    }),
};
```

`apps/api/app/api/uploadthing/route.ts`:

```typescript
import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "./core";

export const { GET, POST } = createRouteHandler({ router: uploadRouter });
```

## Frontend Component

```typescript
"use client";
import { useUploadThing } from "@/uploadthing";

export function FileUpload({ onComplete }) {
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => onComplete(res[0].url),
  });

  return (
    <input
      type="file"
      onChange={(e) => e.target.files && startUpload(Array.from(e.target.files))}
      disabled={isUploading}
    />
  );
}
```

## Alternative: AWS S3

For full control, use `@aws-sdk/client-s3` with pre-signed URLs.

**Pricing:** UploadThing free 2GB, S3 $0.023/GB/month

[UploadThing docs](https://docs.uploadthing.com) · [S3 docs](https://docs.aws.amazon.com/s3)
