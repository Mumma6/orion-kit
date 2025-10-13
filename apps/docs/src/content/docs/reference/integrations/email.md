---
title: Adding Email
description: Integrate Resend for transactional emails
---

# Adding Email

Complete guide to adding email functionality using Resend.

## What You'll Get

- ✅ Transactional emails
- ✅ Email templates with React
- ✅ Type-safe email sending
- ✅ Delivery tracking
- ✅ Production-ready

## Why Resend?

- Modern API with great DX
- React Email support
- Generous free tier (3,000 emails/month)
- Built for developers
- Great deliverability

## Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up with GitHub
3. Verify your email
4. Get API key from dashboard

## Step 2: Install Dependencies

```bash
# Install Resend and React Email
pnpm add resend
pnpm add @react-email/components
```

## Step 3: Add Environment Variables

Add to `apps/api/.env.local`:

```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@yourdomain.com
```

**Note:** You need to verify your domain in Resend dashboard for production. During development, you can use `onboarding@resend.dev`.

## Step 4: Create Email Package

Create `packages/email/` directory:

```bash
mkdir -p packages/email/src/templates
```

### Package.json

Create `packages/email/package.json`:

```json
{
  "name": "@workspace/email",
  "version": "0.0.0",
  "private": true,
  "exports": {
    ".": "./src/index.ts",
    "./templates/*": "./src/templates/*.tsx"
  },
  "dependencies": {
    "@react-email/components": "latest",
    "react": "^19.0.0",
    "resend": "latest"
  },
  "devDependencies": {
    "@workspace/typescript-config": "workspace:*",
    "typescript": "^5.7.3"
  }
}
```

## Step 5: Create Email Templates

### Welcome Email Template

Create `packages/email/src/templates/welcome.tsx`:

```typescript
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  userName: string;
  dashboardUrl: string;
}

export function WelcomeEmail({ userName, dashboardUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Orion Kit!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Orion Kit!</Heading>

          <Text style={text}>
            Hi {userName},
          </Text>

          <Text style={text}>
            Thanks for signing up! We're excited to have you on board.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              Go to Dashboard
            </Button>
          </Section>

          <Text style={text}>
            If you have any questions, just reply to this email.
          </Text>

          <Text style={footer}>
            Best regards,<br />
            The Orion Kit Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 40px",
};

const buttonContainer = {
  padding: "27px 0 27px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#000",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  padding: "0 40px",
};

export default WelcomeEmail;
```

## Step 6: Create Email Service

Create `packages/email/src/index.ts`:

```typescript
import { Resend } from "resend";
import { WelcomeEmail } from "./templates/welcome";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

interface SendWelcomeEmailParams {
  to: string;
  userName: string;
  dashboardUrl: string;
}

export async function sendWelcomeEmail({
  to,
  userName,
  dashboardUrl,
}: SendWelcomeEmailParams) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Welcome to Orion Kit!",
    react: WelcomeEmail({ userName, dashboardUrl }),
  });

  if (error) {
    console.error("Failed to send welcome email:", error);
    throw new Error("Failed to send email");
  }

  return data;
}

// Export templates for testing
export { WelcomeEmail } from "./templates/welcome";
```

## Step 7: Use in Your API

Send email after user signs up. Update Clerk webhook handler:

```typescript
// apps/api/app/webhooks/clerk/route.ts
import { sendWelcomeEmail } from "@workspace/email";

export async function POST(req: Request) {
  // ... existing webhook code

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name } = evt.data;

    // Send welcome email
    try {
      await sendWelcomeEmail({
        to: email_addresses[0].email_address,
        userName: first_name ?? "there",
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      });
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      // Don't fail the webhook if email fails
    }
  }

  // ...
}
```

## Step 8: Add to Workspace

Update root `package.json`:

```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

Install dependencies:

```bash
pnpm install
```

## More Email Templates

### Password Reset Email

Create `packages/email/src/templates/password-reset.tsx`:

```typescript
interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
}

export function PasswordResetEmail({
  userName,
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Password Reset Request</Heading>

          <Text style={text}>Hi {userName},</Text>

          <Text style={text}>
            We received a request to reset your password. Click the button
            below to create a new password:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>

          <Text style={text}>
            This link will expire in 1 hour. If you didn't request this,
            you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### Task Reminder Email

Create `packages/email/src/templates/task-reminder.tsx`:

```typescript
interface TaskReminderEmailProps {
  userName: string;
  taskTitle: string;
  taskUrl: string;
  dueDate: string;
}

export function TaskReminderEmail({
  userName,
  taskTitle,
  taskUrl,
  dueDate,
}: TaskReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Task due soon: {taskTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Task Reminder</Heading>

          <Text style={text}>Hi {userName},</Text>

          <Text style={text}>
            Your task <strong>{taskTitle}</strong> is due on {dueDate}.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={taskUrl}>
              View Task
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

## Preview Emails Locally

Create `packages/email/dev.tsx`:

```typescript
import { render } from "@react-email/render";
import { WelcomeEmail } from "./src/templates/welcome";

// Preview in browser
console.log(
  render(
    WelcomeEmail({
      userName: "John Doe",
      dashboardUrl: "http://localhost:3001/dashboard",
    })
  )
);
```

Run with:

```bash
npx tsx packages/email/dev.tsx
```

## Production Setup

### 1. Verify Your Domain

1. Go to Resend Dashboard → Domains
2. Click "Add Domain"
3. Add your domain (e.g., `yourdomain.com`)
4. Add DNS records:
   - SPF: `v=spf1 include:_spf.resend.com ~all`
   - DKIM: Provided by Resend
5. Wait for verification (usually < 1 hour)

### 2. Update Environment Variables

Production `.env`:

```bash
RESEND_API_KEY=re_live_...
RESEND_FROM_EMAIL=no-reply@yourdomain.com
```

## Testing

Create `packages/email/__tests__/email.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { render } from "@react-email/render";
import { WelcomeEmail } from "../src/templates/welcome";

describe("WelcomeEmail", () => {
  it("renders with user name", () => {
    const html = render(
      WelcomeEmail({
        userName: "John",
        dashboardUrl: "https://app.example.com/dashboard",
      })
    );

    expect(html).toContain("Hi John");
    expect(html).toContain("Welcome to Orion Kit!");
  });
});
```

## Best Practices

### 1. Don't Block Requests

Send emails asynchronously:

```typescript
// ❌ Bad - blocks request
await sendWelcomeEmail({ ... });

// ✅ Good - fire and forget
sendWelcomeEmail({ ... }).catch(console.error);
```

### 2. Handle Failures Gracefully

```typescript
try {
  await sendEmail({ ... });
} catch (error) {
  // Log but don't throw
  console.error("Email failed:", error);
  // Optionally queue for retry
}
```

### 3. Use Email Preferences

Check user preferences before sending:

```typescript
const preferences = await getUserPreferences(userId);

if (preferences.emailNotifications) {
  await sendEmail({ ... });
}
```

## Monitoring

Check email delivery in Resend dashboard:

- Delivery status
- Open rates
- Click rates
- Bounces and complaints

## Pricing

| Plan     | Emails/month | Price |
| -------- | ------------ | ----- |
| Free     | 3,000        | $0    |
| Pro      | 50,000       | $20   |
| Business | 100,000      | $80   |

[View full pricing →](https://resend.com/pricing)

## Alternative: SendGrid

For SendGrid instead of Resend:

```bash
pnpm add @sendgrid/mail
```

```typescript
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: "user@example.com",
  from: "noreply@yourdomain.com",
  subject: "Welcome!",
  html: emailHtml,
});
```

## Learn More

- [Resend Documentation](https://resend.com/docs)
- [React Email Documentation](https://react.email/docs)
- [Email Templates Examples](https://react.email/examples)
