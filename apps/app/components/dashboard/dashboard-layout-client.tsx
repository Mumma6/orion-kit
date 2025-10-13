"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ErrorFallback } from "@/components/error-fallback";
import { ErrorBoundary } from "react-error-boundary";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
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
