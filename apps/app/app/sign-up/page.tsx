import { SignUp } from "@workspace/auth/client";
import { OrionLogo } from "@workspace/ui/components/orion-logo";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Link
          href="http://localhost:3000"
          className="hover:opacity-80 transition-opacity"
        >
          <OrionLogo size="lg" />
        </Link>
        <p className="text-sm text-muted-foreground">
          Create your account to get started
        </p>
      </div>

      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        forceRedirectUrl="/dashboard"
      />

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Learn more about{" "}
        <Link
          href="http://localhost:3000"
          className="text-primary hover:underline"
        >
          Orion Kit
        </Link>
      </div>
    </div>
  );
}
