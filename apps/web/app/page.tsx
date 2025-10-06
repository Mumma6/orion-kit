import { Button } from "@workspace/ui/components/button";
import { ModeToggle } from "@/components/mode-toggle";
import LandingPage from "@/components/landing/landing";
import NewLanding from "@/components/new-landing";

export default function Page() {
  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-end px-4">
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
      </header>
      <NewLanding />
    </div>
  );
}
