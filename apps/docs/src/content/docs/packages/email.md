---
title: Email Package
description: Resend integration with React Email templates
---

# @workspace/email

Transactional email system using **Resend** for delivery and **React Email** for beautiful, responsive templates.

## What's Included

### 📦 Package Structure

```
packages/email/src/
├── client.ts              # Resend client and email functions
├── index.ts               # Main exports
└── templates/
    ├── index.ts           # Template exports
    └── welcome-email.tsx  # Welcome email template
```

### 🎯 Core Features

- **✅ Resend Integration** - Reliable email delivery service
- **✅ React Email Templates** - Beautiful, responsive email components
- **✅ Welcome Emails** - Automatic sending on user registration
- **✅ Database Tracking** - `welcomeMailSent` field tracks delivery
- **✅ Type Safety** - Full TypeScript support
- **✅ Error Handling** - Graceful fallbacks when email service unavailable

### 📍 Where It's Used

- **`apps/api/app/auth/register/route.ts`** - Sends welcome emails on registration
- **`packages/database/src/schema.ts`** - `welcomeMailSent` field in users table
- **`packages/email/src/templates/`** - React Email components

## How It Works

1. **User registers** → API creates user account
2. **Welcome email sent** → `sendWelcomeEmail()` called with user details
3. **React Email renders** → Template converted to HTML
4. **Resend delivers** → Email sent via Resend API
5. **Database updated** → `welcomeMailSent` set to `true`

## Setup

### 1. Resend Configuration

1. Get API key from [Resend Dashboard](https://resend.com/api-keys)
2. Add environment variables:

```bash
# apps/api/.env.local
RESEND_API_KEY=re_...
FROM_EMAIL=onboarding@resend.dev  # or your domain
```

### 2. Domain Verification (Production)

For production, verify your domain in Resend:

1. Go to [Resend Domains](https://resend.com/domains)
2. Add your domain (e.g., `yourdomain.com`)
3. Add DNS records (SPF, DKIM)
4. Update `FROM_EMAIL` to your domain:

```bash
FROM_EMAIL=hello@yourdomain.com
```

## API Reference

### Core Functions

**`sendEmail(options)`**

Sends any email with a React Email template:

```typescript
import { sendEmail } from "@workspace/email";
import { MyCustomEmail } from "./templates/my-custom-email";

const result = await sendEmail({
  to: "user@example.com",
  subject: "Custom Email",
  react: MyCustomEmail({ name: "John" }),
});

if (result.success) {
  console.log("Email sent:", result.id);
} else {
  console.error("Failed:", result.error);
}
```

**`sendWelcomeEmail(email, name)`**

Sends welcome email to new users:

```typescript
import { sendWelcomeEmail } from "@workspace/email";

const result = await sendWelcomeEmail("user@example.com", "John Doe");
```

### Email Options

```typescript
interface SendEmailOptions {
  to: string; // Recipient email
  subject: string; // Email subject
  react: React.ReactElement; // React Email component
}
```

### Response Format

```typescript
// Success
{
  success: true;
  id: "re_1234567890"; // Resend email ID
}

// Error
{
  success: false;
  error: "Email service not configured";
}
```

## Creating Templates

### React Email Components

Create new templates in `packages/email/src/templates/`:

```typescript
// packages/email/src/templates/password-reset.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import type { FC } from "react";

interface PasswordResetEmailProps {
  resetUrl: string;
  name: string;
}

export const PasswordResetEmail: FC<PasswordResetEmailProps> = ({
  resetUrl,
  name,
}) => (
  <Html>
    <Head />
    <Preview>Reset your password, {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading style={h1}>Reset your password</Heading>
          <Text style={text}>
            Hi {name}, you requested a password reset.
          </Text>
          <Button style={button} href={resetUrl}>
            Reset Password
          </Button>
          <Text style={text}>
            If you didn't request this, please ignore this email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "24px",
  borderRadius: "0 0 8px 8px",
  textAlign: "center" as const,
};

const h1 = {
  color: "#1d2d3d",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px 0",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 10px 0",
};

const button = {
  backgroundColor: "#556cd6",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
  margin: "20px 0",
};
```

### Export Template

```typescript
// packages/email/src/templates/index.ts
export { WelcomeEmail } from "./welcome-email";
export { PasswordResetEmail } from "./password-reset";
```

### Add Email Function

```typescript
// packages/email/src/client.ts
import { PasswordResetEmail } from "./templates/password-reset";

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetUrl: string
) {
  return sendEmail({
    to: email,
    subject: "Reset your password",
    react: PasswordResetEmail({ resetUrl, name }),
  });
}
```

## Usage Examples

### In API Routes

```typescript
// apps/api/app/auth/reset-password/route.ts
import { sendPasswordResetEmail } from "@workspace/email";

export async function POST(request: Request) {
  const { email } = await request.json();

  // Generate reset URL
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  // Send email
  const result = await sendPasswordResetEmail(email, user.name, resetUrl);

  if (result.success) {
    return NextResponse.json({ message: "Reset email sent" });
  } else {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
```

### In Background Jobs

```typescript
// packages/jobs/trigger/send-newsletter.ts
import { task } from "@trigger.dev/sdk/v3";
import { sendEmail } from "@workspace/email";
import { NewsletterEmail } from "./templates/newsletter";

export const sendNewsletter = task({
  id: "send-newsletter",
  run: async (payload: { subscribers: string[]; content: string }) => {
    const results = [];

    for (const email of payload.subscribers) {
      const result = await sendEmail({
        to: email,
        subject: "Weekly Newsletter",
        react: NewsletterEmail({ content: payload.content }),
      });

      results.push({ email, success: result.success });
    }

    return { sent: results.filter((r) => r.success).length };
  },
});
```

## Testing

### Development

```bash
# Set up Resend test key
RESEND_API_KEY=re_test_...
FROM_EMAIL=onboarding@resend.dev

# Test email sending
pnpm dev
# Register a new user
# Check email delivery in Resend dashboard
```

### Production

```bash
# Use production Resend key
RESEND_API_KEY=re_...
FROM_EMAIL=hello@yourdomain.com

# Verify domain in Resend dashboard
# Test with real email addresses
```

## Error Handling

The email package gracefully handles errors:

```typescript
// When RESEND_API_KEY is not set
const result = await sendWelcomeEmail("user@example.com", "John");
// Returns: { success: false, error: "Email service not configured" }

// When Resend API fails
const result = await sendWelcomeEmail("invalid-email", "John");
// Returns: { success: false, error: "Failed to send email" }
```

## Pricing

- **Free tier:** 3,000 emails/month
- **Pro:** $20/month for 50,000 emails
- **Enterprise:** Custom pricing

See [Resend Pricing](https://resend.com/pricing) for details.

## Best Practices

### ✅ Template Design

- Use React Email components for consistency
- Test templates in multiple email clients
- Keep subject lines under 50 characters
- Include both HTML and text versions

### ✅ Error Handling

```typescript
// Always check result
const result = await sendWelcomeEmail(email, name);
if (!result.success) {
  logger.warn("Email failed", { error: result.error, email });
  // Continue with user registration even if email fails
}
```

### ✅ Performance

- Send emails asynchronously when possible
- Use background jobs for bulk emails
- Cache template rendering for repeated sends

## Package Exports

```typescript
// Main functions
import { sendEmail, sendWelcomeEmail } from "@workspace/email";

// Templates
import { WelcomeEmail } from "@workspace/email/templates";
```

## Further Reading

- [Resend Documentation](https://resend.com/docs)
- [React Email Components](https://react.email/docs)
- [Email Best Practices](https://resend.com/docs/send-with-react)
- [Template Gallery](https://react.email/templates)
