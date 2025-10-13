---
title: Adding File Uploads
description: Integrate UploadThing for file uploads
---

# Adding File Uploads

Complete guide to adding file upload functionality using UploadThing.

## What You'll Get

- ✅ Drag-and-drop file uploads
- ✅ Image optimization
- ✅ File type validation
- ✅ Progress indicators
- ✅ CDN delivery
- ✅ Type-safe uploads

## Why UploadThing?

- Built for Next.js App Router
- Zero configuration needed
- Free CDN hosting
- Automatic image optimization
- Great developer experience
- Generous free tier (2GB storage, 2GB bandwidth)

## Alternative: AWS S3

UploadThing is easier for most use cases. Use S3 if you:

- Need full control over storage
- Have high bandwidth requirements (>100GB/month)
- Want to self-host

## Step 1: Create UploadThing Account

1. Go to [uploadthing.com](https://uploadthing.com)
2. Sign up with GitHub
3. Create a new app
4. Copy your API keys

## Step 2: Install Dependencies

```bash
# Install UploadThing
pnpm add uploadthing @uploadthing/react
```

## Step 3: Add Environment Variables

Add to `apps/api/.env.local`:

```bash
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=your_app_id
```

Add to `apps/app/.env.local`:

```bash
NEXT_PUBLIC_UPLOADTHING_APP_ID=your_app_id
```

## Step 4: Create Upload Router

Create `apps/api/app/api/uploadthing/core.ts`:

```typescript
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@workspace/auth/server";

const f = createUploadthing();

export const uploadRouter = {
  // Image upload for avatars
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Optionally save to database
      // await db.insert(files).values({ url: file.url, userId: metadata.userId });

      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // PDF upload for documents
  pdfUploader: f({ pdf: { maxFileSize: "16MB", maxFileCount: 5 } })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF uploaded:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
```

## Step 5: Create Upload Endpoint

Create `apps/api/app/api/uploadthing/route.ts`:

```typescript
import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});
```

## Step 6: Configure TypeScript

Create `apps/app/uploadthing.ts`:

```typescript
import { generateReactHelpers } from "@uploadthing/react";
import type { UploadRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<UploadRouter>();
```

## Step 7: Create Upload Component

Create `apps/app/components/upload/file-upload.tsx`:

```typescript
"use client";

import { useUploadThing } from "@/uploadthing";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";
import { toast } from "sonner";

interface FileUploadProps {
  onUploadComplete?: (url: string) => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      toast.success("Upload complete!");
      if (res?.[0]?.url) {
        onUploadComplete?.(res[0].url);
      }
    },
    onUploadError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    await startUpload(files);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground"
      />

      {files.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground">
            Selected: {files[0].name}
          </p>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      )}
    </div>
  );
}
```

## Step 8: Use in Your App

### Avatar Upload Example

```typescript
"use client";

import { FileUpload } from "@/components/upload/file-upload";
import { useState } from "react";

export function UserProfile() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  return (
    <div>
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="h-24 w-24 rounded-full"
        />
      )}

      <FileUpload onUploadComplete={setAvatarUrl} />
    </div>
  );
}
```

## Advanced: Drag and Drop

Install react-dropzone:

```bash
pnpm add react-dropzone
```

Create `apps/app/components/upload/dropzone.tsx`:

```typescript
"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/uploadthing";
import { toast } from "sonner";

export function Dropzone() {
  const { startUpload, isUploading } = useUploadThing("imageUploader");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const res = await startUpload(acceptedFiles);
        if (res) {
          toast.success(`Uploaded ${res.length} file(s)`);
        }
      } catch (error) {
        toast.error("Upload failed");
      }
    },
    [startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 5,
    maxSize: 4 * 1024 * 1024, // 4MB
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
        isDragActive ? "border-primary bg-primary/10" : "border-muted"
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Drag & drop files here, or click to select</p>
      )}
      {isUploading && <p className="mt-2 text-sm">Uploading...</p>}
    </div>
  );
}
```

## Database Integration

Store file metadata in database:

### 1. Add Schema

Update `packages/database/src/schema.ts`:

```typescript
export const files = pgTable("files", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkUserId: varchar({ length: 255 }).notNull(),
  url: varchar({ length: 512 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  size: integer().notNull(), // bytes
  type: varchar({ length: 100 }).notNull(), // mime type
  createdAt: timestamp().defaultNow().notNull(),
});

export type File = typeof files.$inferSelect;
```

### 2. Save on Upload

Update `apps/api/app/api/uploadthing/core.ts`:

```typescript
.onUploadComplete(async ({ metadata, file }) => {
  await db.insert(files).values({
    clerkUserId: metadata.userId,
    url: file.url,
    name: file.name,
    size: file.size,
    type: file.type,
  });

  return { url: file.url };
}),
```

## Security Best Practices

### 1. File Type Validation

```typescript
imageUploader: f({
  image: {
    maxFileSize: "4MB",
    maxFileCount: 1,
  },
})
  .middleware(async () => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId };
  })
  .onUploadComplete(async ({ file }) => {
    // Validate file type server-side
    if (!file.type.startsWith("image/")) {
      throw new Error("Invalid file type");
    }
    return { url: file.url };
  }),
```

### 2. User Quota Limits

```typescript
.middleware(async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Check user's upload quota
  const userFiles = await db
    .select()
    .from(files)
    .where(eq(files.clerkUserId, userId));

  const totalSize = userFiles.reduce((sum, f) => sum + f.size, 0);
  const maxSize = 100 * 1024 * 1024; // 100MB per user

  if (totalSize > maxSize) {
    throw new Error("Storage quota exceeded");
  }

  return { userId };
}),
```

### 3. Malware Scanning

For production, consider adding virus scanning:

```typescript
import { scanFile } from "clamav"; // or similar service

.onUploadComplete(async ({ file }) => {
  const isSafe = await scanFile(file.url);
  if (!isSafe) {
    // Delete file and notify admin
    await deleteFile(file.key);
    throw new Error("File failed security scan");
  }
}),
```

## Alternative: AWS S3

For full control, use AWS S3:

```bash
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Create `packages/storage/src/s3.ts`:

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
}
```

## Pricing

### UploadThing

| Plan | Storage | Bandwidth | Price  |
| ---- | ------- | --------- | ------ |
| Free | 2GB     | 2GB/month | $0     |
| Pro  | 100GB   | 100GB/mo  | $20/mo |

### AWS S3

- $0.023/GB storage per month
- $0.09/GB bandwidth
- $0.005/1000 PUT requests
- No free tier after first year

## Learn More

- [UploadThing Documentation](https://docs.uploadthing.com/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Next.js File Uploads](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#uploading-files)
