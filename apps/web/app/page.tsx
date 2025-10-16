import type { Metadata } from "next";
import { Header } from "@/components/header";
import Landing from "@/components/landing";

export const metadata: Metadata = {
  title: "Orion Kit - Production-Ready SaaS Boilerplate for Next.js",
  description:
    "Build SaaS applications faster with Orion Kit. Production-ready Next.js 15 boilerplate with TypeScript, authentication, payments, background jobs, and deployment built-in. Open source and type-safe.",
  keywords: [
    "Next.js boilerplate",
    "SaaS starter kit",
    "TypeScript",
    "React",
    "Stripe payments",
    "JWT authentication",
    "TailwindCSS",
    "Drizzle ORM",
    "Turborepo",
    "monorepo",
    "full-stack",
    "production ready",
    "open source",
  ],
  authors: [{ name: "Orion Kit" }],
  creator: "Orion Kit",
  publisher: "Orion Kit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://orion-kit.dev",
    siteName: "Orion Kit",
    title: "Orion Kit - Production-Ready SaaS Boilerplate for Next.js",
    description:
      "Build SaaS applications faster with Orion Kit. Production-ready Next.js 15 boilerplate with authentication, payments, and more. Open source and type-safe.",
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
      "Build SaaS applications faster with authentication, payments, background jobs, and deployment built-in. Open source and type-safe.",
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
};

export default function Page() {
  return (
    <div className="min-h-svh">
      <Header />
      <Landing />
    </div>
  );
}
