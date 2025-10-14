---
title: Adding Email
description: Resend for transactional emails
---

Transactional emails with **Resend** + **React Email** templates.

## Setup

```bash
pnpm add resend @react-email/components

# apps/api/.env.local
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev  # or your domain
```

Get API key from [resend.com](https://resend.com)

## Email Package

Create `packages/email/`:

**`package.json`:**

```json
{
  "name": "@workspace/email",
  "dependencies": {
    "resend": "latest",
    "@react-email/components": "latest"
  }
}
```

## Email Template

`packages/email/src/templates/welcome.tsx`:

```typescript
import { Html, Button, Container, Heading, Text } from "@react-email/components";

interface WelcomeEmailProps {
  userName: string;
  dashboardUrl: string;
}

export function WelcomeEmail({ userName, dashboardUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Container>
        <Heading>Welcome to Orion Kit!</Heading>
        <Text>Hi {userName}, thanks for signing up!</Text>
        <Button href={dashboardUrl}>Go to Dashboard</Button>
      </Container>
    </Html>
  );
}
```

## Email Service

`packages/email/src/index.ts`:

```typescript
import { Resend } from "resend";
import { WelcomeEmail } from "./templates/welcome";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail({
  to,
  userName,
  dashboardUrl,
}: {
  to: string;
  userName: string;
  dashboardUrl: string;
}) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: "Welcome!",
    react: WelcomeEmail({ userName, dashboardUrl }),
  });

  if (error) throw new Error("Failed to send email");
  return data;
}
```

## Usage

```typescript
import { sendWelcomeEmail } from "@workspace/email";

// Fire and forget (don't block requests)
sendWelcomeEmail({
  to: user.email,
  userName: user.name,
  dashboardUrl: "https://app.com/dashboard",
}).catch(console.error);
```

## Production

1. Verify domain in Resend dashboard
2. Add DNS records (SPF, DKIM)
3. Use `no-reply@yourdomain.com`

**Pricing:** Free 3k emails/mo, $20/mo for 50k

[Resend docs](https://resend.com/docs) · [React Email](https://react.email/docs)
