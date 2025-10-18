"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ErrorFallback } from "@/components/error-fallback";
import { ErrorBoundary } from "react-error-boundary";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { useAuth } from "@/hooks/use-auth";

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: authData, isPending, error } = useAuth();
  const router = useRouter();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isPending && (!authData?.data || error)) {
      router.push("/");
    }
  }, [authData, isPending, error, router]);

  // Show loading while checking auth
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!authData?.data || error) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={(error, info) => {
            console.error("Error Boundary caught:", error, info);
          }}
        >
          <div className="flex flex-1 flex-col">{children}</div>
        </ErrorBoundary>
      </SidebarInset>
    </SidebarProvider>
  );
}
