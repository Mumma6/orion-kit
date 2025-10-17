"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { OrionLogo } from "@workspace/ui/components/orion-logo";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function RootPage() {
  const { data: authData, isPending } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (!isPending && authData?.data) {
      router.push("/dashboard");
    }
  }, [authData, isPending, router]);

  // Show loading while checking auth
  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="mb-8 flex flex-col items-center gap-4">
          <OrionLogo size="lg" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is logged in (will redirect)
  if (authData?.data) {
    return null;
  }

  // Show landing page
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center gap-4">
        <OrionLogo size="lg" />
        <h1 className="text-4xl font-bold text-center">Welcome to Orion Kit</h1>
        <p className="text-lg text-muted-foreground text-center max-w-md">
          A modern, full-stack development kit built with Next.js, TypeScript,
          and Tailwind CSS.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
        <Link href="/signup">
          <Button variant="outline">Sign Up</Button>
        </Link>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Built with modern technologies and best practices</p>
      </div>
    </div>
  );
}
