"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import {
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  Circle,
  XCircle,
} from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { Skeleton } from "@workspace/ui/components/skeleton";

export default function AnalyticsPage() {
  const { data: tasksData, isLoading } = useTasks();

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
    ];

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
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.tasksThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.completedThisWeek} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.tasksThisMonth}</div>
            <p className="text-xs text-muted-foreground">Tasks created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {analytics.completionRate}%
            </div>
            <p className="text-xs text-muted-foreground">Overall progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksData?.total || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
            <CardDescription>
              Distribution of tasks by current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.statusBreakdown.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.status}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${item.color}`} />
                        <span className="text-sm font-medium">
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{item.count}</span>
                        <span className="text-xs text-muted-foreground">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest task updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity.length > 0 ? (
                analytics.recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between pb-4 border-b last:border-b-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.date}
                      </p>
                    </div>
                    <Badge
                      variant={
                        activity.status === "completed"
                          ? "default"
                          : activity.status === "in-progress"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {activity.status === "todo"
                        ? "To Do"
                        : activity.status === "in-progress"
                          ? "In Progress"
                          : activity.status === "completed"
                            ? "Completed"
                            : "Cancelled"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Productivity Insights</CardTitle>
          <CardDescription>
            Tips and trends based on your task management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-green-500">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold">Great Progress!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You've completed {analytics.completedThisWeek} tasks this week.
                {analytics.completedThisWeek > 5
                  ? " Keep up the momentum!"
                  : " You're doing well!"}
              </p>
            </div>

            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-blue-500">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">In Progress</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You have {tasksData?.inProgress || 0} tasks in progress.
                {(tasksData?.inProgress || 0) > 3
                  ? " Consider completing some before starting new ones."
                  : " Good balance!"}
              </p>
            </div>

            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-purple-500">
                <Target className="h-5 w-5" />
                <span className="font-semibold">Focus Area</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {analytics.completionRate >= 70
                  ? "You're highly productive! Keep it up."
                  : analytics.completionRate >= 40
                    ? "Good progress. Try completing more tasks to boost your rate."
                    : "Consider breaking down tasks into smaller, manageable pieces."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
