"use client";

import { useTasks } from "@/hooks/use-tasks";
import { DashboardWelcome } from "./dashboard-welcome";
import { DashboardStats } from "./dashboard-stats";
import { DashboardTasksPreview } from "./dashboard-tasks-preview";
import { DashboardLoading } from "./dashboard-loading";
import { DashboardError } from "./dashboard-error";

interface UserData {
  readonly id: string;
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly email: string | null;
  readonly imageUrl: string | null;
}

interface DashboardContentProps {
  readonly user: UserData;
}

export function DashboardContent({ user }: DashboardContentProps) {
  const { data: tasks, isLoading, error, refetch } = useTasks();

  if (tasks) {
    console.log("📋 Tasks from TanStack Query:", tasks);
  }

  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <DashboardWelcome firstName={user.firstName} />

      {error && <DashboardError error={error} onRetry={refetch} />}

      {!error && tasks && (
        <>
          <DashboardStats
            total={tasks.total}
            completed={tasks.completed}
            inProgress={tasks.inProgress}
            todo={tasks.todo}
          />

          <DashboardTasksPreview tasks={tasks.data} />
        </>
      )}
    </div>
  );
}
