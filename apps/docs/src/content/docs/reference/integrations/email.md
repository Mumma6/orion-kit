---
title: Adding Email
description: Resend for transactional emails
---

Transactional emails with **Resend** + **React Email** templates. Already included in Orion Kit!

## Setup

```bash
# apps/api/.env.local
RESEND_API_KEY=re_...
FROM_EMAIL=onboarding@resend.dev  # or your domain
```

Get API key from [resend.dev](https://resend.dev)

## Already Included

Orion Kit comes with a complete email package:

- ✅ **`@workspace/email`** - Email package with Resend
- ✅ **Welcome email template** - Beautiful React Email template
- ✅ **Automatic sending** - Welcome emails on user registration
- ✅ **Database tracking** - `welcomeMailSent` field in users table

## Usage

```typescript
import { sendWelcomeEmail } from "@workspace/email";

// Send welcome email (already integrated in registration)
await sendWelcomeEmail("user@example.com", "John Doe");
```

## Customizing Templates

Edit `packages/email/src/templates/welcome-email.tsx`:

```typescript
import { Html, Body, Container, Heading, Text } from "@react-email/components";

export const WelcomeEmail = ({ name }: { name: string }) => (
  <Html>
    <Body>
      <Container>
        <Heading>Welcome {name}! 🚀</Heading>
        <Text>Thanks for joining Orion Kit!</Text>
        <Text>You can now access your dashboard.</Text>
      </Container>
    </Body>
  </Html>
);
```

## Adding More Email Types

```typescript
// packages/email/src/templates/password-reset.tsx
export const PasswordResetEmail = ({ resetUrl }: { resetUrl: string }) => (
  <Html>
    <Body>
      <Container>
        <Heading>Reset your password</Heading>
        <Button href={resetUrl}>Reset Password</Button>
      </Container>
    </Body>
  </Html>
);

// packages/email/src/client.ts
export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  return sendEmail({
    to: email,
    subject: "Reset your password",
    react: PasswordResetEmail({ resetUrl }),
  });
}
```

## Production Setup

1. **Verify domain** in Resend dashboard
2. **Add DNS records** (SPF, DKIM)
3. **Update FROM_EMAIL** to your domain:
   ```bash
   FROM_EMAIL=hello@yourdomain.com
   ```

## Pricing

- **Free tier:** 3,000 emails/month
- **Pro:** $20/month for 50,000 emails
- **Enterprise:** Custom pricing

## Development vs Production

- **Development:** Use `onboarding@resend.dev` (works immediately)
- **Production:** Verify your domain for better deliverability

## Resources

- [Resend Documentation](https://resend.dev/docs)
- [React Email Components](https://react.email/docs)
- [Email Best Practices](https://resend.dev/docs/send-with-react)
