"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { AlertCircle } from "lucide-react";

interface DashboardErrorProps {
  readonly error: Error | unknown;
  readonly onRetry: () => void;
}

export function DashboardError({ error, onRetry }: DashboardErrorProps) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-base">Failed to load tasks</CardTitle>
        </div>
        <CardDescription>
          {error instanceof Error
            ? error.message
            : "An error occurred while fetching your tasks. Please try again."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onRetry} variant="outline" size="sm">
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
