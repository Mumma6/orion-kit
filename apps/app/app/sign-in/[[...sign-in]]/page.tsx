import { SignIn } from "@workspace/auth/client";
import { OrionLogo } from "@workspace/ui/components/orion-logo";
import Link from "next/link";

const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Link href={webUrl} className="hover:opacity-80 transition-opacity">
          <OrionLogo size="lg" />
        </Link>
        <p className="text-sm text-muted-foreground">
          Sign in to access your dashboard
        </p>
      </div>

      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
        forceRedirectUrl="/dashboard"
      />

      <div className="mt-6 text-center text-sm text-muted-foreground">
        New to Orion Kit?{" "}
        <Link href={webUrl} className="text-primary hover:underline">
          Learn more
        </Link>
      </div>
    </div>
  );
}
