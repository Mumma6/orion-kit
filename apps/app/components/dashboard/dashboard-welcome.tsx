"use client";

import { Rocket } from "lucide-react";

interface DashboardWelcomeProps {
  readonly name: string;
}

export function DashboardWelcome({ name }: DashboardWelcomeProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-6">
      <div className="rounded-2xl bg-primary p-3">
        <Rocket className="h-8 w-8 text-primary-foreground" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Welcome back, {name}!</h2>
        <p className="text-muted-foreground">
          Ready to manage your tasks and projects
        </p>
      </div>
    </div>
  );
}
