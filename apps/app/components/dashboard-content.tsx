"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { CheckCircle2, Circle, Clock, Loader2, Rocket } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import type { Task } from "@workspace/types";

interface UserData {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  imageUrl: string | null;
}

export function DashboardContent({ user }: { user: UserData }) {
  // Use TanStack Query hook - automatic loading, error, caching!
  const { data: tasks, isLoading, error, refetch } = useTasks();

  // Log to console when data changes
  if (tasks) {
    console.log("📋 Tasks from TanStack Query:", tasks);
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "todo":
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "todo":
        return "To Do";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Welcome Section */}
      <div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-6">
        <div className="rounded-2xl bg-primary p-3">
          <Rocket className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            Welcome back, {user.firstName || "User"}!
          </h2>
          <p className="text-muted-foreground">
            Ready to manage your tasks and projects
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {tasks && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {tasks.completed}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {tasks.inProgress}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">To Do</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">
                {tasks.todo}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>API Integration with TanStack Query</CardTitle>
          <CardDescription>
            Tasks are automatically fetched from the API using TanStack Query.
            Click to refetch or they'll auto-refresh on window focus.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => refetch()} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Rocket className="mr-2 h-4 w-4" />
                Refetch Tasks
              </>
            )}
          </Button>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              <strong>Error:</strong>{" "}
              {error instanceof Error ? error.message : "Failed to fetch tasks"}
            </div>
          )}

          {tasks && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-medium">
                  ✅ Successfully fetched {tasks.total} tasks for{" "}
                  {tasks.userName}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Check the browser console for the full response. Data is
                  cached and automatically refetches on window focus.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks List */}
      {tasks && tasks.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>
              A list of tasks fetched from the API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.data.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="mt-0.5">{getStatusIcon(task.status)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{task.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {getStatusText(task.status)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card - Only show when no tasks loaded */}
      {!tasks && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Ready to explore?</CardTitle>
            <CardDescription>
              Click the button above to test the API integration and see how
              data flows between your dashboard and backend.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
