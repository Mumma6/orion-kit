import { currentUser } from "@workspace/auth/server";
import { redirect } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { OrionLogo } from "@workspace/ui/components/orion-logo";
import Link from "next/link";

export default async function RootPage() {
  console.log("RootPage");
  const user = await currentUser();
  console.log(user);

  if (user) {
    redirect("/dashboard");
  }

  // Show landing page instead of redirecting
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center gap-4">
        <OrionLogo size="lg" />
        <h1 className="text-4xl font-bold text-center">Welcome to Orion Kit</h1>
        <p className="text-lg text-muted-foreground text-center max-w-md">
          A modern, full-stack development kit built with Next.js, TypeScript,
          Kinde, and Tailwind CSS.
        </p>
      </div>

      <div className="flex gap-4">
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Built with modern technologies and best practices</p>
      </div>
    </div>
  );
}
