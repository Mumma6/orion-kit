---
title: Web Application
description: Marketing landing page with SEO optimization
---

The web application (`apps/web`) is the marketing landing page that showcases Orion Kit and drives user acquisition.

**Purpose**: Marketing landing page and user acquisition  
**Framework**: Next.js 15 with App Router  
**Port**: `3000` (development)  
**Domain**: `orion-kit.dev` (production)  
**SEO**: Comprehensive meta tags

## Structure

```
apps/web/
├── app/
│   ├── layout.tsx                 # Root layout with SEO metadata
│   ├── page.tsx                   # Landing page content
│   ├── providers.tsx              # React providers
│   └── favicon.ico                # Site favicon
├── components/
│   ├── header.tsx                 # Site header with navigation
│   ├── landing.tsx                # Main landing page component
│   ├── landing/
│   │   ├── cta.tsx               # Call-to-action section
│   │   ├── features.tsx          # Features showcase
│   │   ├── footer.tsx            # Site footer
│   │   ├── hero.tsx              # Hero section
│   │   ├── showcase.tsx          # Product showcase
│   │   └── tech-stack.tsx        # Technology stack display
│   └── mode-toggle.tsx           # Dark/light mode toggle
├── public/
│   └── assets/                   # Static assets and images
└── package.json                  # Dependencies and scripts
```

## Pages

### **Landing Page** (`/`)

Main marketing page with:

- **Hero section** with value proposition
- **Features showcase** highlighting key benefits
- **Technology stack** display
- **Product showcase** with screenshots
- **Call-to-action** buttons
- **Footer** with links and information

## Components

### **Hero Section**

```typescript
// apps/web/components/landing/hero.tsx
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Production-Ready SaaS Boilerplate for{' '}
          <span className="text-primary">Next.js</span>
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
          Build faster with authentication, payments, analytics, and deployment
          built-in. Open source and type-safe.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="https://github.com/orion-kit/orion">
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/docs">
              <BookOpen className="mr-2 h-5 w-5" />
              Documentation
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
```

### **Features Showcase**

```typescript
// apps/web/components/landing/features.tsx
const features: Feature[] = [
  {
    icon: Shield,
    title: 'Authentication',
    description: 'Clerk integration with sign-in, sign-up, and user management',
  },
  {
    icon: CreditCard,
    title: 'Payments',
    description: 'Stripe subscriptions with checkout, billing portal, and webhooks',
  },
  {
    icon: Database,
    title: 'Database',
    description: 'Neon PostgreSQL with Drizzle ORM and type-safe queries',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'PostHog for events, funnels, and feature flags',
  },
  {
    icon: Zap,
    title: 'Background Jobs',
    description: 'Trigger.dev for scheduled tasks and async processing',
  },
  {
    icon: Rocket,
    title: 'Deployment',
    description: 'Vercel-ready with environment variables and CI/CD',
  },
];

export function Features() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything you need to build SaaS
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Production-ready features without the boilerplate
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6">
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### **Technology Stack**

```typescript
// apps/web/components/landing/tech-stack.tsx
const technologies: Tech[] = [
  {
    emoji: '⚡',
    title: 'Next.js 15',
    description: 'Latest React framework with App Router',
  },
  {
    emoji: '🔷',
    title: 'TypeScript',
    description: 'Type-safe development with strict mode',
  },
  {
    emoji: '🎨',
    title: 'Tailwind CSS',
    description: 'Utility-first CSS framework',
  },
  {
    emoji: '🔐',
    title: 'Clerk',
    description: 'Authentication and user management',
  },
  {
    emoji: '💳',
    title: 'Stripe',
    description: 'Payments and subscription billing',
  },
  {
    emoji: '🗄️',
    title: 'Neon',
    description: 'Serverless PostgreSQL database',
  },
  {
    emoji: '📊',
    title: 'PostHog',
    description: 'Product analytics and feature flags',
  },
  {
    emoji: '📝',
    title: 'Drizzle ORM',
    description: 'Type-safe database queries',
  },
];

export function TechStack() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Built with modern tools
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Industry-standard technologies for production apps
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {technologies.map((tech) => (
            <div key={tech.title} className="text-center">
              <div className="text-4xl mb-2">{tech.emoji}</div>
              <h3 className="font-semibold">{tech.title}</h3>
              <p className="text-sm text-muted-foreground">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## SEO Optimization

### **Meta Tags**

```typescript
// apps/web/app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "Orion Kit - Production-Ready SaaS Boilerplate for Next.js",
    template: "%s | Orion Kit",
  },
  description:
    "Build faster with authentication, payments, analytics, and deployment built-in. Open source and type-safe SaaS boilerplate for Next.js.",
  keywords: [
    "Next.js",
    "SaaS",
    "boilerplate",
    "TypeScript",
    "authentication",
    "payments",
    "Stripe",
    "Clerk",
    "PostgreSQL",
    "Drizzle",
    "PostHog",
    "Vercel",
  ],
  authors: [{ name: "Orion Kit Team" }],
  creator: "Orion Kit",
  publisher: "Orion Kit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://orion-kit.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://orion-kit.dev",
    siteName: "Orion Kit",
    title: "Orion Kit - Production-Ready SaaS Boilerplate for Next.js",
    description:
      "Build faster with authentication, payments, analytics, and deployment built-in. Open source and type-safe.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Orion Kit - Production-Ready SaaS Boilerplate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orion Kit - Production-Ready SaaS Boilerplate for Next.js",
    description:
      "Build faster with authentication, payments, analytics, and deployment built-in. Open source and type-safe.",
    images: ["/og-image.png"],
    creator: "@orionkit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
};
```

## Environment Variables

```bash
# apps/web/.env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## Development

### **Start Development Server**

```bash
cd apps/web
pnpm dev
```

Application runs on `http://localhost:3000`

### **Build for Production**

```bash
cd apps/web
pnpm build
```

### **Preview Production Build**

```bash
cd apps/web
pnpm start
```

## Production Deployment

### **Vercel Deployment**

```bash
cd apps/web
vercel --prod
```

### **Custom Domain**

Configure custom domain in Vercel:

```
orion-kit.dev → Web application
```

## Performance

### **Image Optimization**

```typescript
import Image from 'next/image';

export function Showcase() {
  return (
    <div className="relative">
      <Image
        src="/assets/dashboard-screenshot.png"
        alt="Orion Kit Dashboard"
        width={1200}
        height={800}
        priority
        className="rounded-lg shadow-2xl"
      />
    </div>
  );
}
```

### **Font Optimization**

```typescript
// apps/web/app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

## Analytics

### **PostHog Integration**

```typescript
// apps/web/app/providers.tsx
import { PostHogProvider } from '@workspace/analytics';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      {children}
    </PostHogProvider>
  );
}
```

### **Vercel Analytics**

```typescript
// apps/web/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Related

- [Main Application](/apps/app)
- [API Application](/apps/api)
- [Analytics Package](/packages/analytics)
- [UI Package](/packages/ui)
