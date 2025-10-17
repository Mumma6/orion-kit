# @workspace/email

Email package for Orion Kit using Resend and React Email.

## Features

- ✅ Resend integration for reliable email delivery
- ✅ React Email for beautiful, responsive email templates
- ✅ Type-safe email sending
- ✅ Welcome email template

## Usage

```typescript
import { sendWelcomeEmail } from "@workspace/email";

// Send welcome email
await sendWelcomeEmail("user@example.com", "John Doe");
```

## Environment Variables

```bash
RESEND_API_KEY=re_...
FROM_EMAIL=onboarding@resend.dev
```

## Templates

- `WelcomeEmail` - Welcome email for new users
