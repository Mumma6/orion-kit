"use client";

import { useTasks } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";
import { DashboardWelcome } from "./dashboard-welcome";
import { DashboardStats } from "./dashboard-stats";
import { DashboardTasksPreview } from "./dashboard-tasks-preview";
import { DashboardLoading } from "./dashboard-loading";
import { DashboardError } from "./dashboard-error";

export function DashboardContent() {
  const { data: authData, isPending: userLoading } = useAuth();
  const user = authData?.data || null;
  const { data: tasks, isLoading: tasksLoading, error, refetch } = useTasks();

  const isLoading = userLoading || tasksLoading;

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in</h2>
          <p className="text-muted-foreground">
            You need to be logged in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <DashboardWelcome name={user?.name || ""} />

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
