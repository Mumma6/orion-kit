"use client";

import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { CheckCircle2, Clock, Circle, XCircle } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { AnalyticsStats } from "./analytics-stats";
import { AnalyticsStatusBreakdown } from "./analytics-status-breakdown";
import { AnalyticsRecentActivity } from "./analytics-recent-activity";
import { AnalyticsInsights } from "./analytics-insights";
import { AnalyticsLoading } from "./analytics-loading";
import { AnalyticsError } from "./analytics-error";

export function AnalyticsContent() {
  const { data: tasksData, isLoading, refetch } = useTasks();

  // Calculate analytics
  const analytics = useMemo(() => {
    if (!tasksData?.data) return null;

    const tasks = tasksData.data;
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const tasksThisWeek = tasks.filter(
      (t) => new Date(t.createdAt) >= last7Days
    ).length;

    const tasksThisMonth = tasks.filter(
      (t) => new Date(t.createdAt) >= last30Days
    ).length;

    const completedThisWeek = tasks.filter(
      (t) => t.status === "completed" && new Date(t.createdAt) >= last7Days
    ).length;

    const completionRate =
      tasks.length > 0
        ? Math.round((tasksData.completed / tasks.length) * 100)
        : 0;

    // Group by status for breakdown
    const statusBreakdown = [
      {
        status: "To Do",
        count: tasksData.todo,
        percentage: Math.round((tasksData.todo / tasks.length) * 100) || 0,
        color: "text-muted-foreground",
        icon: Circle,
      },
      {
        status: "In Progress",
        count: tasksData.inProgress,
        percentage:
          Math.round((tasksData.inProgress / tasks.length) * 100) || 0,
        color: "text-blue-500",
        icon: Clock,
      },
      {
        status: "Completed",
        count: tasksData.completed,
        percentage: Math.round((tasksData.completed / tasks.length) * 100) || 0,
        color: "text-green-500",
        icon: CheckCircle2,
      },
      {
        status: "Cancelled",
        count: tasks.filter((t) => t.status === "cancelled").length,
        percentage:
          Math.round(
            (tasks.filter((t) => t.status === "cancelled").length /
              tasks.length) *
              100
          ) || 0,
        color: "text-red-500",
        icon: XCircle,
      },
    ] as const;

    // Recent activity (last 5 tasks)
    const recentActivity = [...tasks]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((task) => ({
        title: task.title,
        status: task.status,
        date: new Date(task.createdAt).toLocaleDateString(),
      }));

    return {
      tasksThisWeek,
      tasksThisMonth,
      completedThisWeek,
      completionRate,
      statusBreakdown,
      recentActivity,
    };
  }, [tasksData]);

  if (isLoading) {
    return <AnalyticsLoading />;
  }

  if (!tasksData) {
    return (
      <AnalyticsError
        error={new Error("No data available")}
        onRetry={refetch}
      />
    );
  }

  if (!analytics) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-primary p-3">
          <BarChart3 className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Track your productivity and task insights
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <AnalyticsStats
        tasksThisWeek={analytics.tasksThisWeek}
        tasksThisMonth={analytics.tasksThisMonth}
        completedThisWeek={analytics.completedThisWeek}
        completionRate={analytics.completionRate}
        total={tasksData.total}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Breakdown */}
        <AnalyticsStatusBreakdown statusBreakdown={analytics.statusBreakdown} />

        {/* Recent Activity */}
        <AnalyticsRecentActivity recentActivity={analytics.recentActivity} />
      </div>

      {/* Productivity Insights */}
      <AnalyticsInsights
        completedThisWeek={analytics.completedThisWeek}
        inProgress={tasksData.inProgress}
        completionRate={analytics.completionRate}
      />
    </div>
  );
}
